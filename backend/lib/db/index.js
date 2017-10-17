'use strict';

module.exports = dependencies => {

  const Organization = require('./organization')(dependencies);
  const Contract = require('./contract')(dependencies);
  const Order = require('./order')(dependencies);

  return {
    Organization,
    Contract,
    Order
  };
};
