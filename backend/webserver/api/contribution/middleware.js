'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error } = require('../utils')(dependencies);
  const { CONTRIBUTION_STATUS_LIST } = require('../constants');

  return {
    canCreateContribution,
    canUpdateContribution,
    canRemoveContribution,
    validateContributionCreatePayload,
    validateContributionUpdatePayload,
    validateContributionStatusUpdatePayload
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

  function validateContributionStatusUpdatePayload(req, res, next) {
    const middlewares = [
      validateStatus
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

  function validateStatus(req, res, next) {
    const { stepName } = req.body;

    if (!stepName || !CONTRIBUTION_STATUS_LIST.includes(stepName)) {
      return send400Error('invalid status', res);
    }

    next();
  }
};
