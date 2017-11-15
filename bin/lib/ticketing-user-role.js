'use strict';

const MongoClient = require('mongodb').MongoClient;
const trim = require('trim');
const Q = require('q');
const commons = require('./commons');
const { dependencies } = require('./utils');

require('../../backend/lib/db/ticketing-user-role')(dependencies);
const ticUserRoleLibModule = require('../../backend/lib/ticketing-user-role')(dependencies);

module.exports = {
  create
};

function create(email, role) {
  return Q.ninvoke(MongoClient, 'connect', commons.getDBOptions().connectionString)
    .then(dbConnection => {
      const User = dbConnection.collection('users');

      return Q.ninvoke(User, 'findOne', _buildFindByEmailQuery(email))
        .then(user => {
          if (!user) {
            dbConnection.close();

            return Q.reject(new Error('user does not exist'));
          }

          return ticUserRoleLibModule.getByUser(user._id)
            .then(userRole => {
              if (userRole) {
                if (userRole.role === role) {
                  return;
                }

                userRole.role = role;

                return ticUserRoleLibModule.updateById(userRole._id, userRole);
              }

              userRole = {
                user: user._id,
                role
              };

              return ticUserRoleLibModule.create(userRole);
            });
        })
        .then(() => dbConnection.close());
    });
}

function _buildFindByEmailQuery(email) {
  return {
    accounts: {
      $elemMatch: {
        emails: trim(email).toLowerCase()
      }
    }
  };
}
