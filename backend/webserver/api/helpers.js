'use strict';

module.exports = (dependencies, lib) => {
  const { send400Error, send403Error, send500Error } = require('./utils')(dependencies);
  const mongoose = dependencies('db').mongo.mongoose;
  const ObjectId = mongoose.Types.ObjectId;

  return {
    loadUserRole,
    validateObjectIds,
    requireAdministrator,
    buildUserDisplayName
  };

  function requireAdministrator(req, res, next) {
    if (!req.user || !req.user._id) {
      return send400Error('Missing user', res);
    }

    return lib.ticketingUserRole.userIsAdministrator(req.user._id)
      .then(isAdministrator => {
        if (!isAdministrator) {
          return send403Error('User is not the administrator', res);
        }

        next();
      })
      .catch(err => send500Error('Unable to check administrator permission', err, res));
  }

  function loadUserRole(req, res, next) {
    if (!req.user || !req.user._id) {
      return send400Error('Missing user', res);
    }

    return lib.ticketingUserRole.getByUser(req.user._id)
      .then(ticketingUserRole => {
        if (!ticketingUserRole) {
          return send403Error('User not found', res);
        }

        req.user.role = ticketingUserRole.role;
        next();
      })
      .catch(err => send500Error('Unable to load user\'s role', err, res));
  }

  function validateObjectIds(ids) {
    ids = Array.isArray(ids) ? ids : [ids];

    return !ids.some(id => !_validateObjectId(id));
  }

  function _validateObjectId(id) {
    return ObjectId.isValid(String(id));
  }

  function buildUserDisplayName(user) {
    return (user.firstname && user.lastname) ? user.firstname + ' ' + user.lastname : user.preferredEmail;
  }
};
