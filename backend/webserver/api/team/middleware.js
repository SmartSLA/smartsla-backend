'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error } = require('../utils')(dependencies);

  return {
    canCreateTeam,
    canListTeam,
    canUpdateTeam,
    validateTeamCreatePayload,
    validateTeamUpdatePayload
  };

  function canCreateTeam(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListTeam(req, res, next) {
    next(); // TODO Improve permissions
  }

  function canUpdateTeam(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateTeamCreatePayload(req, res, next) {
    const middlewares = [
      validateBasicInfo
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateTeamUpdatePayload(req, res, next) {
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
};
