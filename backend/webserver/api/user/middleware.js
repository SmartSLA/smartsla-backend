'use strict';

const { parseOneAddress } = require('email-addresses');

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error } = require('../utils')(dependencies);

  return {
    canCreate,
    canUpdate,
    validateUserCreatePayload,
    validateUserUpdatePayload
  };

  function canCreate(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdate(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateUserCreatePayload(req, res, next) {
    const { firstname, lastname, email, main_phone } = req.body;

    if (!firstname) {
      return send400Error('firstname is required', res);
    }

    if (!lastname) {
      return send400Error('lastname is required', res);
    }

    if (!email) {
      return send400Error('email is required', res);
    }

    if (parseOneAddress(email) === null) {
      return send400Error('email is invalid', res);
    }

    if (!main_phone) {
      return send400Error('main_phone is required', res);
    }

    next();
  }

  function validateUserUpdatePayload(req, res, next) {
    const { main_phone } = req.body;

    if (!main_phone) {
      return send400Error('main_phone is required', res);
    }

    next();
  }
};
