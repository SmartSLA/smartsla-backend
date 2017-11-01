'use strict';

const helpers = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const ContractSchema = new mongoose.Schema({
    active: { type: Boolean, default: true },
    number: { type: String },
    title: { type: String, required: true },
    organization: { type: Schema.ObjectId, ref: 'Organization', required: true },
    manager: { type: Schema.ObjectId, ref: 'User' },
    defaultSupportManager: { type: Schema.ObjectId, ref: 'User' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    openingHours: { type: String },
    orders: [{ type: Schema.ObjectId, ref: 'Order' }],
    permissions: [{
      actor: { type: Schema.ObjectId },
      right: { type: String, validate: [helpers.validateRight, 'Invalid contract right'] }
    }],
    users: [{ type: Schema.ObjectId, ref: 'User' }],
    creation: { type: Date, default: Date.now },
    schemaVersion: {type: Number, default: 1}
  });

  module.exports = mongoose.model('Contract', ContractSchema);
};
