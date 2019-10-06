module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send404Error, send500Error } = require('../utils')(dependencies);

  return {
    canUpdateRole,
    canCreateRoles,
    canDeleteRole,
    canSetRoles,
    canList,
    loadRole
  };

  function canCreateRoles(req, res, next) {
    requireAdministrator(req, res, next);
  }

  function canUpdateRole(req, res, next) {
    requireAdministrator(req, res, next);
  }

  function canDeleteRole(req, res, next) {
    requireAdministrator(req, res, next);
  }

  function loadRole(req, res, next) {
    lib.ticketingUserRole.get(req.params.id).then(role => {
      if (!role) {
        return send404Error('Role not found', res);
      }

      req.ticketingUserRole = role;
      next();
    })
    .catch(err => send500Error('Failed to update contract', err, res));
  }

  function canSetRoles(req, res, next) {
    requireAdministrator(req, res, next);
  }

  function canList(req, res, next) {
    requireAdministrator(req, res, next);
  }
};
