'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const {
    validateObjectIds,
    requireAdministrator
  } = require('../../helpers')(dependencies, lib);
  const { validatePermissions } = require('./permission')(dependencies, lib);
  const { validateSoftwareToAdd, validateSoftwareToUpdate } = require('./software')(dependencies, lib);
  const { validateDemand } = require('./demand')(dependencies, lib);
  const {
    send400Error,
    send404Error,
    send500Error
  } = require('../../utils')(dependencies);

  return {
    load,
    canCreateContract,
    canListContract,
    canUpdateContract,
    canReadContract,
    canAddUsersToContract,
    validateContractPayload,
    validateDemand,
    validatePermissions,
    validateSoftwareToAdd,
    validateSoftwareToUpdate
  };

  function load(req, res, next) {
    lib.contract.getById(req.params.id)
      .then(contract => {
        if (!contract) {
          send404Error('Contract not found', res);
        }

        req.contract = contract;
        next();
      })
      .catch(err => send500Error('Unable to load contract', err, res));
  }

  function canAddUsersToContract(req, res, next) {
    // TODO: Needs to be able to add users when expert?
    return requireAdministrator(req, res, next);
  }

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
    const { permissions } = req.body;
    const middlewares = [
      validateBasicInfo
    ];

    if (permissions) {
      middlewares.push(validatePermissions);
    }

    return composableMw(...middlewares)(req, res, next);
  }

  function validateBasicInfo(req, res, next) {
    const {
      title,
      organization,
      startDate,
      endDate,
      manager,
      defaultSupportManager
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

    next();
  }
};
