'use strict';

const path = require('path');
const q = require('q');
const fs = require('fs');
const ESConfiguration = require('esn-elasticsearch-configuration');

const readdir = q.denodeify(fs.readdir);

module.exports = {
  exit,
  loadMongooseModels,
  logInfo,
  logError,
  getDBOptions,
  getESConfiguration,
  runCommand
};

function log(level, ...message) {
  console.log('[CLI]', level, ...message);
}

function logInfo(...message) {
  log('INFO', ...message);
}

function logError(...message) {
  log('ERROR', ...message);
}

function getDBOptions() {
  const dbConfigFilePath = path.normalize(`${__dirname}/../../config/db.json`);
  const dbConfig = fs.readFileSync(dbConfigFilePath, 'utf8');

  return JSON.parse(dbConfig);
}

function exit(code) {
  process.exit(code); // eslint-disable-line no-process-exit
}

function runCommand(name, command) {
  return command().then(() => {
    logInfo(`Command "${name}" terminated successfully`);

    exit();
  }, err => {
    logError(`Command "${name}" returned an error: ${err}`);

    exit(1);
  });
}

function loadMongooseModels() {
  var ESN_ROOT = path.resolve(__dirname, '../../');
  var MODELS_ROOT = path.resolve(ESN_ROOT, 'backend/lib/db');

  return readdir(MODELS_ROOT).then(function(files) {
    files.forEach(function(filename) {
      var file = path.resolve(MODELS_ROOT, filename);

      if (fs.statSync(file).isFile()) {
        require(file);
      }
    });
  });
}

function getESConfiguration(host = 'localhost', port = 9200) {
  const elasticsearchConfigPath = path.normalize(`${__dirname}/../../config/elasticsearch/`);

  return new ESConfiguration({ path: elasticsearchConfigPath, host, port });
}
