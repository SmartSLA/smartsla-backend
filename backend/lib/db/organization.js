'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const OrganizationSchema = new mongoose.Schema({
    parent: { type: Schema.ObjectId, ref: 'Organization' },
    shortName: { type: String, required: true, unique: true },
    fullName: { type: String },
    type: { type: String },
    address: { type: String },
    administrator: { type: Schema.ObjectId, ref: 'User' },
    contract: { type: Schema.ObjectId, ref: 'Contract' },
    orders: [{ type: Schema.ObjectId, ref: 'Order' }],
    users: [{ type: Schema.ObjectId, ref: 'User' }],
    schemaVersion: {type: Number, default: 1},
    description: { type: String },
    creation: { type: Date, default: Date.now }
  });

  return mongoose.model('Organization', OrganizationSchema);
};
