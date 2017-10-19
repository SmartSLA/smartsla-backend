'use strict';

module.exports = (dependencies, lib) => {
  const {
    validateObjectIds,
    validateRights,
    requireAdministrator
  } = require('../helpers')(dependencies, lib);
  const { send400Error } = require('../utils')(dependencies);

  return {
    canCreateContract,
    canListContract,
    canUpdateContract,
    validateContractPayload,
    validateContractUpdate
  };

  function canCreateContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateContractPayload(req, res, next) {
    const {
      title,
      organization,
      startDate,
      endDate,
      administrator,
      defaultSupportManager,
      permissions,
      users
     } = req.body;

    if (!title) {
      return send400Error('title is required', res);
    }

    if (!organization) {
      return send400Error('organization is required', res);
    }

    if (!startDate) {
      return send400Error('startDate is required', res);
    }

    if (!endDate) {
      return send400Error('endDate is required', res);
    }

    if (!validateObjectIds(organization)) {
      return send400Error('organization is invalid', res);
    }

    if (administrator && !validateObjectIds(administrator)) {
      return send400Error('administrator is invalid', res);
    }

    if (defaultSupportManager && !validateObjectIds(defaultSupportManager)) {
      return send400Error('defaultSupportManager is invalid', res);
    }

    if (users && !validateObjectIds(users)) {
      return send400Error('users is invalid', res);
    }

    if (permissions) {
      const actors = permissions.map(permission => permission.actor);
      const rights = permissions.map(permission => permission.right);

      if (!validateObjectIds(actors) || !validateRights(rights)) {
        return send400Error('permissions is invalid', res);
      }
    }

    next();
  }

  function validateContractUpdate(req, res, next) {
    const { orders } = req.body;

    if (orders && !validateObjectIds(orders)) {
      return send400Error('orders is invalid', res);
    }

    return validateContractPayload(req, res, next);
  }
};
