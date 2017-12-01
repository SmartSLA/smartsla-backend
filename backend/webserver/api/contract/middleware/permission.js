'use strict';

module.exports = (dependencies, lib) => {
  const { validateObjectIds } = require('../../helpers')(dependencies, lib);
  const {
    send400Error,
    send500Error
  } = require('../../utils')(dependencies);

  return {
    validatePermissions
  };

  function validatePermissions(req, res, next) {
    let { permissions } = req.body;

    if (permissions === 1 || (Array.isArray(permissions) && permissions.length === 0)) {
      return next();
    }

    if (Array.isArray(permissions) && validateObjectIds(permissions)) {
      permissions = [...new Set(permissions)];

      return lib.organization.entitiesBelongsOrganization(permissions, req.contract.organization)
        .then(belonged => {
          if (!belonged) {
            return send400Error('entities does not belong to contract\'s organization', res);
          }

          req.body.permissions = permissions;
          next();
        })
        .catch(err => send500Error('Unable to check permissions', err, res));
    }

    return send400Error('permissions is invalid', res);
  }
};
