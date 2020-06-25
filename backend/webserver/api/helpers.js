'use strict';

module.exports = (dependencies, lib) => {
  const { send400Error, send403Error, send500Error } = require('./utils')(dependencies);
  const mongoose = dependencies('db').mongo.mongoose;
  const ObjectId = mongoose.Types.ObjectId;
  const coreUserDenormalizer = dependencies('coreUserDenormalizer');
  const EsnConfig = dependencies('esn-config').EsnConfig;

  return {
    flipFeature,
    loadUserRole,
    validateObjectIds,
    requireAdministrator,
    buildUserDisplayName,
    requireCurrentUserOrAdministrator,
    requireContractManagerOrAdmin
  };

  function flipFeature(featureName) {
    return function(req, res, next) {
      new EsnConfig('smartsla-backend')
        .get('features')
        .then(config => {
          if (config[featureName]) {
            next();
          } else {
            send403Error('Feature not enabled', res);
          }
        });
    };
  }

  function requireAdministrator(req, res, next) {
    if (!req.user || !req.user._id) {
      return send400Error('Missing user', res);
    }

    return Promise.all([
      coreUserDenormalizer.denormalize(req.user, { includeIsPlatformAdmin: true }),
      isTicketingAdmin(req.user._id)
    ])
    .then(([user, isTicketingAdmin]) => {

      if (user.isPlatformAdmin || isTicketingAdmin) {
        return next();
      }

      return send403Error('User does not have the necessary permission', res);
    })
    .catch(err => send500Error('Unable to check administrator permission', err, res));

    function isTicketingAdmin(userId) {
      return lib.ticketingUserRole.userIsAdministrator(userId);
    }
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

  function requireCurrentUserOrAdministrator(req, res, next) {
    if (!req.user || !req.user._id) {
      return send400Error('Missing user', res);
    }

    if (req.user._id.toString() === req.params.id) {
      return next();
    }

    return requireAdministrator(req, res, next);
  }

  function requireContractManagerOrAdmin(req, res, next) {
    return lib.contract.getUserRoleInContract(req.params.id, req.user._id).then(role => {
      if (role === lib.constants.TICKETING_CONTRACT_ROLES.CONTRACT_MANAGER || role === lib.constants.TICKETING_CONTRACT_ROLES.OPERATIONAL_MANAGER) {
        return next();
      }

      return requireAdministrator(req, res, next);
    });
  }
};
