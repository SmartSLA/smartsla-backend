'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const { ContractSchema } = require('./schemas/contract')(dependencies);

  return mongoose.model('Contract', ContractSchema);
};
