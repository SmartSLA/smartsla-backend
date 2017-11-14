'use strict';

module.exports = dependencies => {

  const mongoose = dependencies('db').mongo.mongoose;
  const Organization = mongoose.model('Organization');

  return {
    denormalize,
    getId
  };

  function getId(organization) {
    return organization._id;
  }

  function denormalize(organization) {
    const options = {virtuals: true, depopulate: true, transform: transform};

    function transform(doc, ret) {
      const hideKeys = ['__v', '_id', 'schemaVersion'];

      ret.id = getId(ret);
      hideKeys.forEach(key => { delete ret[key]; });
    }

    return organization instanceof Organization ? organization.toObject(options) : new Organization(organization).toObject(options);
  }
};
