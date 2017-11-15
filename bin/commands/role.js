'use strict';

const { commons, db, ticketingUserRole } = require('../lib');
const { TICKETING_USER_ROLES } = require('../../backend/lib/constants');

module.exports = {
  command: 'role',
  desc: 'Roles management',
  builder: {
    email: {
      alias: 'e',
      describe: 'user email'
    },
    role: {
      alias: 'r',
      describe: 'expectation role',
      choices: Object.values(TICKETING_USER_ROLES)
    }
  },
  handler: argv => {
    const { email, role } = argv;

    return exec(email, role)
      .then(null, commons.logError)
      .finally(commons.exit);
  }
};

function exec(email, role) {
  return db.connect(commons.getDBOptions())
    .then(() => ticketingUserRole.create(email, role))
    .then(() => commons.logInfo(`User role has been set to ${role}`))
    .catch(err => commons.logError(err));
}
