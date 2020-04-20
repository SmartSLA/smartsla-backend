'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error, send403Error } = require('../utils')(dependencies);

  return {
    canCreateClient,
    canListClient,
    canUpdateClient,
    clientCanBeRemoved,
    validateClientCreatePayload,
    validateClientUpdatePayload
  };

  function canCreateClient(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListClient(req, res, next) {
    next(); // TODO Improve permissions
  }

  function canUpdateClient(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateClientCreatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateClientUpdatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateBasicInfo(req, res, next) {
    const { name } = req.body;

    if (!name) {
      return send400Error('name is required', res);
    }

    next();
  }

  function clientCanBeRemoved(req, res, next) {
    return lib.contract.listByClient(req.params.id)
      .then(contracts => {
        if (contracts && contracts.length) {
          return send403Error('client cannot be deleted: related to contracts', res);
        }

        return next();
      });

  }
};
