'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');

  return {
    denormalize,
    getId
  };

  function getId(contract) {
    return contract._id;
  }

  function denormalize(contract) {
    const options = { virtuals: true, depopulate: true, transform: transform };

    function transform(doc, ret) {
      const hideKeys = ['__v', '_id', 'schemaVersion'];

      ret.id = getId(ret);

      hideKeys.forEach(key => { delete ret[key]; });
    }

    const software = contract.software;
    const organization = contract.organization;

    contract = contract instanceof Contract ? contract.toObject(options) : new Contract(contract).toObject(options);
    contract = Object.assign(contract, { software, organization });

    return contract;
  }
};
