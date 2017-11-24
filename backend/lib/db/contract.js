'use strict';

const { uniqueRequests } = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const ContractRequestSchema = new mongoose.Schema({
    requestType: { type: String, required: true },
    softwareType: { type: String, required: true },
    issueType: { type: String, required: true },
    responseTime: { type: Number, default: 0 }, // unit: hours
    workaroundTime: { type: Number, default: 0 }, // unit: hours
    solvingTime: { type: Number, default: 0 }, // unit: hours
    timestamps: {
      creation: { type: Date, default: Date.now }
    }
  }, { _id: false });

  const ContractSoftwareSchema = new mongoose.Schema({
    active: { type: Boolean, default: true },
    template: { type: Schema.ObjectId, ref: 'Software', required: true, unique: true },
    versions: [{ type: String, unique: true }],
    type: { type: String, required: true },
    timestamps: {
      creation: { type: Date, default: Date.now }
    }
  }, { _id: false });

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
    permissions: { type: Schema.Types.Mixed, default: [] },
    requests: [ContractRequestSchema],
    software: [ContractSoftwareSchema],
    creation: { type: Date, default: Date.now },
    schemaVersion: { type: Number, default: 1 }
  });

  const ContractModel = mongoose.model('Contract', ContractSchema);

  ContractSchema.pre('save', function(next) {
    const self = this;

    if (!uniqueRequests(self.requests)) {
      next(new Error('Invalid contract requests'));
    }

    return next();
  });

  return ContractModel;
};
