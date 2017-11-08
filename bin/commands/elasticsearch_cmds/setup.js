'use strict';

const Q = require('q');
const { commons } = require('../../lib');
const { AVAILABLE_INDEX_TYPES } = require('./constants');

module.exports = {
  command: 'setup',
  desc: 'Setup elasticSearch for ticketing module',
  builder: {
    host: {
      alias: 'H',
      describe: 'elasticsearch host to connect to',
      default: 'localhost'
    },
    port: {
      alias: 'p',
      describe: 'elasticsearch port to connect to',
      type: 'number',
      default: 9200
    },
    type: {
      alias: 't',
      describe: 'index type'
    },
    index: {
      alias: 'i',
      describe: 'index to create'
    }
  },
  handler: argv => {
    const { host, port, type, index } = argv;

    exec(host, port, type, index)
      .then(() => commons.logInfo('ElasticSearch has been configured'))
      .catch(commons.logError)
      .finally(commons.exit);
  }
};

function exec(host, port, type, index) {
  const esConfig = commons.getESConfiguration(host, port);

  if (type) {
    index = index || _getDefaultIndex(type);

    return esConfig.setup(index, type);
  }

  return Q.all(AVAILABLE_INDEX_TYPES.map(type => esConfig.setup(_getDefaultIndex(type), type)));
}

function _getDefaultIndex(type) {
  return `${type}.idx`;
}
