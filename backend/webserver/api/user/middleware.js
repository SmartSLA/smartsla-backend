'use strict';

module.exports = (dependencies, lib) => {
  const coreAvailability = dependencies('availability');
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error, send500Error } = require('../utils')(dependencies);

  return {
    loadTicketingUser,
    loadAllowedContracts,
    canCreate,
    canRead,
    canUpdate,
    canList,
    canRemove,
    validateUserCreatePayload
  };

  function loadTicketingUser(req, res, next) {
    lib.user.getById(req.user._id)
      .then(ticketingUser => {
        if (ticketingUser) {
          req.ticketingUser = ticketingUser;
        }
        next();
      })
      .catch(err => {
        send500Error('Can not load ticketing user', err, res);
      });
  }

  function loadAllowedContracts(req, res, next) {
    lib.contract.allowedContracts({ user: req.user, ticketingUser: req.ticketingUser }).then(contract => {
      req.allowedContracts = contract;
      next();
    })
    .catch(err => {
      send500Error(`Cannot load the allowed contract for the user ${req.user._id}`, err, res);
    });
  }

  function canCreate(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canRead(req, res, next) {
    if (!req.user || !req.user._id) {
      return send400Error('Missing user', res);
    }

    if (req.user._id.toString() === req.params.id) {
      return next();
    }

    return requireAdministrator(req, res, next);
  }

  function canUpdate(req, res, next) {
    if (!req.user || !req.user._id) {
      return send400Error('Missing user', res);
    }

    if (req.user._id.toString() === req.ticketingUser.user.toString()) {
      return next();
    }

    return requireAdministrator(req, res, next);
  }

  function canList(req, res, next) {
    next(); // TODO Improve permissions
  }

  function canRemove(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateUserCreatePayload(req, res, next) {
    const { firstname, lastname, email, main_phone, role } = req.body;

    if (!firstname) {
      return send400Error('firstname is required', res);
    }

    if (!lastname) {
      return send400Error('lastname is required', res);
    }

    if (!email) {
      return send400Error('email is required', res);
    }

    if (!main_phone) {
      return send400Error('main_phone is required', res);
    }

    if (role) {
      if (!lib.helpers.validateUserRole(role)) {
        return send400Error('role is invalid', res);
      }

      if (role === lib.constants.TICKETING_USER_ROLES.ADMINISTRATOR) {
        return send400Error('Must not create administrator', res);
      }
    }

    return validateEmail(req, res, next);
  }

  function validateEmail(req, res, next) {
    const { email } = req.body;

    coreAvailability.email.isAvailable(email)
      .then(result => {
        if (!result.available) {
          return send400Error(result.message, res);
        }

        next();
      })
      .catch(err => send500Error('Unable to validate email', err, res));
  }
};
