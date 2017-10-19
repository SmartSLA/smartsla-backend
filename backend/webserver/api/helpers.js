'use strict';

module.exports = (dependencies, lib) => {
  const { send400Error, send403Error, send500Error } = require('./utils')(dependencies);
  const mongoose = dependencies('db').mongo.mongoose;
  const ObjectId = mongoose.Types.ObjectId;

  return {
    validateObjectIds,
    validateRights,
    requireAdministrator
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

  function validateObjectIds(ids) {
    ids = Array.isArray(ids) ? ids : [ids];

    return !ids.some(id => !_validateObjectId(id));
  }

  function validateRights(rights) {
    return !rights.some(right => !lib.helpers.validateRight(right));
  }

  function _validateObjectId(id) {
    try {
      new ObjectId(id);

      return true;
    } catch (err) {
      return false;
    }
  }
};
