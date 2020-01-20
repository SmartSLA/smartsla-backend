'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error } = require('../utils')(dependencies);

  return {
    canCreateContribution,
    canUpdateContribution,
    canRemoveContribution,
    validateContributionCreatePayload,
    validateContributionUpdatePayload
  };

  function canCreateContribution(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateContribution(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canRemoveContribution(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateContributionCreatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateContributionUpdatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateBasicInfo(req, res, next) {
    const { name, software } = req.body;

    if (!name) {
      return send400Error('name is required', res);
    }

    if (!software) {
      return send400Error('software is required', res);
    }

    next();
  }
};
