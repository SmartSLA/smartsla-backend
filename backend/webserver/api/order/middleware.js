'use strict';

module.exports = (dependencies, lib) => {
  const { canListOrder } = require('../contract/middleware')(dependencies, lib);

  return {
    canReadOrder
  };

  function canReadOrder(req, res, next) {
    canListOrder(req, res, next);
  }
};
