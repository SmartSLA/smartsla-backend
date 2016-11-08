'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const address = dependencies('db').mongo.schemas.address;
  const ObjectId = mongoose.Schema.ObjectId;
  const GroupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    client: {
      type: ObjectId,
      ref: 'TicClient'
    },
    preferred_contact: {
      type: String,
      required: true
    },
    address: {
      type: address,
      required: true
    },
    is_active: {
      type: Boolean,
      required: true
    },
    members: [{ type: ObjectId, ref: 'User' }]
  });

  return mongoose.model('TicGroup', GroupSchema);
};
