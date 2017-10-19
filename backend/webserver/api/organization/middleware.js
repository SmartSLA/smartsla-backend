'use strict';

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error } = require('../utils')(dependencies);

  return {
    canCreateOrganization,
    canListOrganization,
    canUpdateOrganization,
    validateOrganizationPayload
  };

  function canCreateOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateOrganizationPayload(req, res, next) {
    const { shortName } = req.body;

    if (!shortName) {
      return send400Error('shortName is required', res);
    }

    next();
  }
};
