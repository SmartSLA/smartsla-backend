'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const address = dependencies('db').mongo.schemas.address;
  const ObjectId = mongoose.Schema.ObjectId;
  const ClientSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    acronym: {
      type: String,
      required: true
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
    access_code: {
      type: String,
      required: true
    },
    access_code_hint: {
      type: String,
      required: true
    },
    groups: [{ type: ObjectId, ref: 'TicGroup' }],
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    logo: ObjectId
  });

  return mongoose.model('TicClient', ClientSchema);
};
