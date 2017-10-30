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
    canReadOrganization,
    canUpdateOrganization,
    validateOrganizationCreatePayload,
    validateOrganizationUpdatePayload
  };

  function canCreateOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canReadOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateOrganization(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateOrganizationCreatePayload(req, res, next) {
    const { shortName, manager } = req.body;

    if (!shortName) {
      return send400Error('shortName is required', res);
    }

    if (manager && !validateObjectIds(manager)) {
      return send400Error('manager is invalid', res);
    }

    lib.organization.getByShortName(shortName)
      .then(organization => {
        if (organization) {
          return send400Error('shortName is taken', res);
        }

        next();
      });
  }

  function validateOrganizationUpdatePayload(req, res, next) {
    const { shortName, manager } = req.body;

    if (!shortName) {
      return send400Error('shortName is required', res);
    }

    if (manager && !validateObjectIds(manager)) {
      return send400Error('manager is invalid', res);
    }

    lib.organization.getByShortName(shortName)
      .then(organization => {
        if (organization && organization._id.toString() !== req.params.id) {
          return send400Error('shortName is taken', res);
        }

        next();
      });
  }
};
