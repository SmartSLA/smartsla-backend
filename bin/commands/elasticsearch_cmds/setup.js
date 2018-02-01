'use strict';

const Q = require('q');
const { commons } = require('../../lib');
const { INDICES } = require('../../../backend/lib/constants');

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
  if (type) {
    const esConfig = commons.getESConfiguration({ host, port, type });

    index = Object.values(INDICES).find(index => (index.type === type)).name;

    return esConfig.setup(index, type);
  }

  return Q.all(Object.values(INDICES).map(index => {
    const esConfig = commons.getESConfiguration({ host, port, type: index.type });

    esConfig.setup(index.name, index.type);
  }));
}
