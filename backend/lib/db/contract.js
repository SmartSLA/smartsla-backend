'use strict';

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
    // available value of permissions:
    // 1 if all entities of contract's organization have permission
    // array of some entities of contract's organization which have permission
    permissions: Schema.Types.Mixed,
    users: [{ type: Schema.ObjectId, ref: 'User' }],
    creation: { type: Date, default: Date.now },
    schemaVersion: {type: Number, default: 1}
  });

  module.exports = mongoose.model('Contract', ContractSchema);
};
