'use strict';

module.exports = (dependencies, lib) => {
  const {
    requireAdministrator,
    validateObjectIds
  } = require('../helpers')(dependencies, lib);
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
    const { shortName, administrator } = req.body;

    if (!shortName) {
      return send400Error('shortName is required', res);
    }

    if (administrator && !validateObjectIds(administrator)) {
      return send400Error('administrator is invalid', res);
    }

    lib.organization.getByShortName(shortName)
      .then(organization => {
        if (organization) {
          return send400Error('shortName is taken', res);
        }

        next();
      });
  }
};
