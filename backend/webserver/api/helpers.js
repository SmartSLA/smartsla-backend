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
    isAdministrator,
    requireAdministrator,
    buildUserDisplayName,
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

  function isAdministrator(user, res) {
    if (!user || !user._id) {
      return send400Error('Missing user', res);
    }

    return Promise.all([
      coreUserDenormalizer.denormalize(user, { includeIsPlatformAdmin: true }),
      isTicketingAdmin(user._id)
    ])
    .then(([user, isTicketingAdmin]) => (user.isPlatformAdmin || isTicketingAdmin));

    function isTicketingAdmin(userId) {
      return lib.ticketingUserRole.userIsAdministrator(userId);
    }
  }

  function requireAdministrator(req, res, next) {
    return isAdministrator(req.user, res)
      .then(isAdmin => {

      if (isAdmin) {
        return next();
      }

      return send403Error('User does not have the necessary permission', res);
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

  function requireContractManagerOrAdmin(req, res, next) {
    const { role } = req.ticketingUser;

    if (
      role === lib.constants.TICKETING_CONTRACT_ROLES.CONTRACT_MANAGER ||
      role === lib.constants.TICKETING_CONTRACT_ROLES.OPERATIONAL_MANAGER ||
      role === lib.constants.TICKETING_CONTRACT_ROLES.VIEWER ||
      role === lib.constants.TICKETING_CONTRACT_ROLES.CUSTOMER ||
      role === lib.constants.EXPERT_ROLE.EXPERT
      ) {
      return next();
    }

    return requireAdministrator(req, res, next);
  }
};
