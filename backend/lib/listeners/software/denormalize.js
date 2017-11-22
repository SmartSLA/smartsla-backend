'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Software = mongoose.model('Software');

  return {
    denormalize,
    getId
  };

  function getId(software) {
    return software._id;
  }

  function denormalize(software) {
    const options = {virtuals: true, depopulate: true, transform: transform};

    function transform(doc, ret) {
      const hideKeys = ['__v', '_id', 'schemaVersion'];

      ret.id = getId(ret);
      hideKeys.forEach(key => { delete ret[key]; });
    }

    return software instanceof Software ? software.toObject(options) : new Software(software).toObject(options);
  }
};
