'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingUserContractModel = mongoose.model('TicketingUserContract');
  const { ContractSchema } = require('./schemas/contract')(dependencies);

  ContractSchema.post('findOneAndRemove', function(contract) {
    TicketingUserContractModel.remove({ contract: contract._id }).exec();
  });

  return mongoose.model('Contract', ContractSchema);
};
