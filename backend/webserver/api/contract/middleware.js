/*eslint-disable no-warning-comments*/

'use strict';

const composableMw = require('composable-middleware');

module.exports = (dependencies, lib) => {
  const {
    validateObjectIds,
    validateRights,
    requireAdministrator
  } = require('../helpers')(dependencies, lib);
  const {
    send400Error,
    send404Error,
    send500Error
  } = require('../utils')(dependencies);

  return {
    load,
    canCreateContract,
    canListContract,
    canUpdateContract,
    canCreateOrder,
    canListOrder,
    canReadContract,
    canUpdateOrder,
    validateContractPayload,
    validateOrderPayload,
    validatePermissions,
    validateSoftware
  };

  function load(req, res, next) {
    lib.contract.getById(req.params.id)
      .then(contract => {
        if (!contract) {
          send404Error('Contract not found', res);
        }

        req.contract = contract;
        next();
      })
      .catch(err => send500Error('Unable to load contract', err, res));
  }

  function canCreateContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canReadContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateContract(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateContractPayload(req, res, next) {
    const { permissions } = req.body;
    const middlewares = [
      validateBasicInfo
    ];

    if (permissions) {
      middlewares.push(validatePermissions);
    }

    return composableMw(...middlewares)(req, res, next);
  }

  function validateBasicInfo(req, res, next) {
    const {
      title,
      organization,
      startDate,
      endDate,
      manager,
      defaultSupportManager
     } = req.body;

    if (!title) {
      return send400Error('title is required', res);
    }

    if (!organization) {
      return send400Error('organization is required', res);
    }

    if (!startDate) {
      return send400Error('startDate is required', res);
    }

    if (!endDate) {
      return send400Error('endDate is required', res);
    }

    if (!validateObjectIds(organization)) {
      return send400Error('organization is invalid', res);
    }

    if (manager && !validateObjectIds(manager)) {
      return send400Error('manager is invalid', res);
    }

    if (defaultSupportManager && !validateObjectIds(defaultSupportManager)) {
      return send400Error('defaultSupportManager is invalid', res);
    }

    next();
  }

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

  function validateSoftware(req, res, next) {
    const middlewares = [
      validateSoftwareFormat,
      checkSoftwareTypesAvailable,
      checkDuplicatedSoftware,
      checkSoftwareAvailable,
      checkSoftwareVersionsAvailable
    ];

    return composableMw(...middlewares)(req, res, next);
  }

  function validateSoftwareFormat(req, res, next) {
    const { template, type, versions } = req.body;

    if (!validateObjectIds(template)) {
      return send400Error('Software not found', res);
    }

    if (!versions) {
      return send400Error('Software versions is required', res);
    }

    if (!Array.isArray(versions) || versions.length === 0) {
      return send400Error('Software versions must not be empty', res);
    }

    if (!type) {
      return send400Error('Software type is required', res);
    }

    next();
  }

  function checkDuplicatedSoftware(req, res, next) {
    const { template } = req.body;
    const availableSoftwareIds = req.contract.software.map(item => item.template.toString());

    if (availableSoftwareIds.indexOf(template) > -1) {
      return send400Error('Software already exists', res);
    }

    next();
  }

  function checkSoftwareAvailable(req, res, next) {
    const { template } = req.body;

    lib.software.isSoftwareAvailable(template)
      .then(isAvailable => {
        if (!isAvailable) {
          return send400Error('Software is not available', res);
        }

        next();
      })
      .catch(err => send500Error('Unable to check software', err, res));
  }

  function checkSoftwareVersionsAvailable(req, res, next) {
    const { template, versions } = req.body;

    lib.software.isSoftwareVersionsAvailable(template, versions)
      .then(isAvailable => {
        if (!isAvailable) {
          return send400Error('Software versions are unsupported', res);
        }

        next();
      })
      .catch(err => send500Error('Unable to check software versions', err, res));
  }

  function checkSoftwareTypesAvailable(req, res, next) {
    const { type } = req.body;

    const availableTypes = req.contract.requests.map(request => request.softwareType);

    if (availableTypes.indexOf(type) === -1) {
      return send400Error('Software type is unsupported', res);
    }

    next();
  }

  function canCreateOrder(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canListOrder(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canUpdateOrder(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateOrderPayload(req, res, next) {
    const {
      title,
      startDate,
      terminationDate,
      manager,
      defaultSupportManager,
      defaultSupportTechnician,
      permissions
    } = req.body;

    if (!title) {
      return send400Error('title is required', res);
    }

    if (!startDate) {
      return send400Error('startDate is required', res);
    }

    if (!terminationDate) {
      return send400Error('terminationDate is required', res);
    }

    if (new Date(startDate) > new Date(terminationDate)) {
      return send400Error('startDate must not be bigger than terminationDate', res);
    }

    if (manager && !validateObjectIds(manager)) {
      return send400Error('manager is invalid', res);
    }

    if (defaultSupportManager && !validateObjectIds(defaultSupportManager)) {
      return send400Error('defaultSupportManager is invalid', res);
    }

    if (defaultSupportTechnician && !validateObjectIds(defaultSupportTechnician)) {
      return send400Error('defaultSupportTechnician is invalid', res);
    }

    if (permissions) {
      const actors = permissions.map(permission => permission.actor);
      const rights = permissions.map(permission => permission.right);

      if (!validateObjectIds(actors) || !validateRights(rights)) {
        return send400Error('permissions is invalid', res);
      }
    }

    // TODO: call _validateOrderDurationDate function to verify Order date with Contract date.
    // Enable midway test
    // return _validateOrderDurationDate(req, res, next);
    next();
  }

  // TODO: call _validateOrderDurationDate function to verify Order date with Contract date
  // Enable midway test
  /*function _validateOrderDurationDate(req, res, next) {
    lib.contract.getById(req.params.id)
      .then(contract => {
        if (new Date(req.body.startDate) < contract.startDate) {
          return send400Error(`startDate must not be less than ${contract.startDate}`, res);
        }

        if (new Date(req.body.terminationDate) > contract.endDate) {
          return send400Error(`terminationDate must not be bigger than ${contract.endDate}`, res);
        }

        next();
      });
  }*/
};
