module.exports = (dependencies, lib) => {
  const coreUser = dependencies('coreUser');
  const { send500Error, send400Error } = require('../utils')(dependencies);

  return {
    list,
    updateRole,
    createRoles
  };

  function createRoles(req, res) {
    if (!req.body || !req.body.length) {
      return send400Error('Array of {user,role} is required', res);
    }

    lib.ticketingUserRole.createMultiple(req.body)
      .then(created => res.status(201).json(created))
      .catch(err => send500Error('Unable to get role', err, res));
  }

  function list(req, res) {
    lib.ticketingUserRole.list({ limit: -1, offset: 0 })
      .then(roles => {
        roles = roles.map(role => ({
          _id: role._id,
          role: role.role,
          user: coreUser.denormalize.denormalize(role.user)
        }));

        res.status(200).json(roles);
      })
      .catch(err => send500Error('Unable to get role', err, res));
  }

  function updateRole(req, res) {
    lib.ticketingUserRole.updateRoleById(req.ticketingUserRole._id, req.body.role)
      .then(() => res.status(200).send())
      .catch(err => send500Error('Failed to update role', err, res));
  }
};
