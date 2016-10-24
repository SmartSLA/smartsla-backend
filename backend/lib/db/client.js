'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;
  const ClientSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    address: {
      type: dependencies('db').mongo.schemas.address,
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
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    logo: ObjectId
  });

  return mongoose.model('TicClient', ClientSchema);
};
