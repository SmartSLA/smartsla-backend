/*eslint-disable no-warning-comments*/

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
    canCreateOrder,
    canListOrder,
    canReadContract,
    canUpdateOrder,
    validateContractPayload,
    validateContractUpdate,
    validateOrderPayload
  };

  function canCreateContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canReadContract(req, res, next) {
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
      manager,
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

    if (manager && !validateObjectIds(manager)) {
      return send400Error('manager is invalid', res);
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

  function canCreateOrder(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListOrder(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateOrder(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateOrderPayload(req, res, next) {
    const {
      title,
      startDate,
      terminationDate,
      manager,
      defaultSupportManager,
      defaultSupportTechnician,
      permissions
    } = req.body;

    if (!title) {
      return send400Error('title is required', res);
    }

    if (!startDate) {
      return send400Error('startDate is required', res);
    }

    if (!terminationDate) {
      return send400Error('terminationDate is required', res);
    }

    if (new Date(startDate) > new Date(terminationDate)) {
      return send400Error('startDate must not be bigger than terminationDate', res);
    }

    if (manager && !validateObjectIds(manager)) {
      return send400Error('manager is invalid', res);
    }

    if (defaultSupportManager && !validateObjectIds(defaultSupportManager)) {
      return send400Error('defaultSupportManager is invalid', res);
    }

    if (defaultSupportTechnician && !validateObjectIds(defaultSupportTechnician)) {
      return send400Error('defaultSupportTechnician is invalid', res);
    }

    if (permissions) {
      const actors = permissions.map(permission => permission.actor);
      const rights = permissions.map(permission => permission.right);

      if (!validateObjectIds(actors) || !validateRights(rights)) {
        return send400Error('permissions is invalid', res);
      }
    }

    // TODO: call _validateOrderDurationDate function to verify Order date with Contract date.
    // Enable midway test
    // return _validateOrderDurationDate(req, res, next);
    next();
  }

  // TODO: call _validateOrderDurationDate function to verify Order date with Contract date
  // Enable midway test
  /*function _validateOrderDurationDate(req, res, next) {
    lib.contract.getById(req.params.id)
      .then(contract => {
        if (new Date(req.body.startDate) < contract.startDate) {
          return send400Error(`startDate must not be less than ${contract.startDate}`, res);
        }

        if (new Date(req.body.terminationDate) > contract.endDate) {
          return send400Error(`terminationDate must not be bigger than ${contract.endDate}`, res);
        }

        next();
      });
  }*/
};
