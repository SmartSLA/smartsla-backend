'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error, send500Error } = require('../utils')(dependencies);

  return {
    canCreateSoftware,
    canListSoftware,
    canUpdateSoftware,
    validateSoftwareCreatePayload,
    validateSoftwareUpdatePayload
  };

  function canCreateSoftware(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListSoftware(req, res, next) {
    next(); // TODO Improve permissions
  }

  function canUpdateSoftware(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateSoftwareCreatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo,
      uniqueSoftwareNameToCreate
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateSoftwareUpdatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo,
      uniqueSoftwareNameToUpdate
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

  function uniqueSoftwareNameToCreate(req, res, next) {
    const { name } = req.body;

    lib.software.getByName(name)
      .then(software => {
        if (software) {
          return send400Error('name is taken', res);
        }

        next();
      }, err => send500Error('Error while checking softwaretest/unit-storage/lib/db/software.js name', err, res));
  }

  function uniqueSoftwareNameToUpdate(req, res, next) {
    const { name } = req.body;

    lib.software.getByName(name)
      .then(software => {
        if (software && software._id.toString() !== req.params.id) {
          return send400Error('name is taken', res);
        }

        next();
      }, err => send500Error('Error while checking software name', err, res));
  }
};
