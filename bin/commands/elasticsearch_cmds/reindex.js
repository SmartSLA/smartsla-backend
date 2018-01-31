'use strict';

const Q = require('q');
const {
  commons,
  contract,
  db,
  organization,
  software,
  ticketingUserRole,
  utils
} = require('../../lib');
const { INDICES } = require('../../../backend/lib/constants');
const HANDLERS = {
  organizations: reindexOrganizations,
  software: reindexSoftware,
  contracts: reindexContracts,
  users: reindexUsers
};

module.exports = {
  command: 'reindex',
  desc: 'Reindex MongoDB data into Elasticsearch',
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
      describe: 'the data type to reindex',
      choices: Object.values(INDICES).map(index => index.type),
      demand: true
    }
  },
  handler: argv => {
    const { host, port, type } = argv;

    return exec(host, port, type)
      .then(null, commons.logError)
      .finally(commons.exit);
  }
};

function exec(host, port, type) {
  const handler = HANDLERS[type];

  if (!handler) {
    return Q.reject(`Unknown data type ${type}`);
  }

  try {
    const esConfig = commons.getESConfiguration({ host, port, type });

    return commons.loadMongooseModels()
      .then(() => handler(esConfig));
  } catch (e) {
    return Q.reject(e);
  }
}

function reindexOrganizations(esConfig) {
  const options = {
    type: 'organizations',
    name: 'organizations.idx',
    denormalize: organization => {
      organization = organization.toObject();
      organization.id = organization._id;
      delete organization._id;

      return organization;
    }
  };
  const cursor = organization.listByCursor();

  options.next = function() {
    return cursor.next();
  };

  commons.logInfo('Starting reindexing of organizations');

  return db.connect(commons.getDBOptions())
    .then(() => esConfig.reindexAll(options))
    .finally(db.disconnect);
}

function reindexSoftware(esConfig) {
  const options = {
    type: 'software',
    name: 'software.idx',
    denormalize: software => {
      software = software.toObject();
      software.id = software._id;
      delete software._id;

      return software;
    }
  };
  const cursor = software.listByCursor();

  options.next = function() {
    return cursor.next();
  };

  commons.logInfo('Starting reindexing of software');

  return db.connect(commons.getDBOptions())
    .then(() => esConfig.reindexAll(options))
    .finally(db.disconnect);
}

function reindexContracts(esConfig) {
  const options = {
    type: 'contracts',
    name: 'contracts.idx',
    denormalize: contract => {
      contract = contract.toObject();
      contract.id = contract._id;
      const hideKeys = ['__v', '_id', 'schemaVersion'];

      hideKeys.forEach(key => { delete contract[key]; });

      return contract;
    }
  };
  const cursor = contract.listByCursor();

  options.next = function() {
    return cursor.next();
  };

  commons.logInfo('Starting reindexing of contracts');

  return db.connect(commons.getDBOptions())
    .then(() => esConfig.reindexAll(options))
    .finally(db.disconnect);
}

function reindexUsers(esConfig) {
  const { denormalize } = require('../../../backend/lib/listeners/user/denormalize')(utils.dependencies);
  const cursor = ticketingUserRole.listByCursor();
  const options = {
    type: 'users',
    name: 'ticketing.users.idx',
    denormalize: userRole => {
      const user = userRole.user;

      user.role = userRole.role;

      return denormalize(user);
    },
    next: function() {
      return cursor.next();
    }
  };

  commons.logInfo('Starting reindexing of users');

  return db.connect(commons.getDBOptions())
    .then(() => esConfig.reindexAll(options))
    .finally(db.disconnect);
}
