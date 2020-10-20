'use strict';

module.exports = (dependencies, lib) => {
  const { send404Error, send403Error } = require('../utils')(dependencies);

  return {
    canCreateTicket
  };

  function canCreateTicket(req, res, next) {
    const notification = req.body;

    lib.contract.getById(notification.configurationUid.split('-')[0]).then(contract => {
      if (!contract) {
        return send404Error('Contract not found', res);
      }

      if (!contract.features.linInfoSec) {
        return send403Error('Can not create a ticket: LinInfoSec is disabled for this contract', res);
      }

      next();
    });
  }
};
