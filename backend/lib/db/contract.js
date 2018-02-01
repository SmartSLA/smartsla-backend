'use strict';

const { uniqueDemands } = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const ContractDemandSchema = new Schema({
    demandType: { type: String, required: true },
    softwareType: { type: String },
    issueType: { type: String },
    responseTime: { type: Number, default: 0 }, // unit: minute
    workaroundTime: { type: Number, default: 0 }, // unit: minute
    correctionTime: { type: Number, default: 0 }, // unit: minute
    timestamps: {
      creation: { type: Date, default: Date.now }
    }
  }, { _id: false });

  const ContractSoftwareSchema = new Schema({
    active: { type: Boolean, default: true },
    template: { type: Schema.ObjectId, ref: 'Software', required: true },
    versions: [{ type: String, unique: true }],
    type: { type: String, required: true },
    timestamps: {
      creation: { type: Date, default: Date.now }
    }
  }, { _id: false });

  const ContractSchema = new Schema({
    active: { type: Boolean, default: true },
    number: { type: String },
    title: { type: String, required: true },
    organization: { type: Schema.ObjectId, ref: 'Organization', required: true },
    manager: { type: Schema.ObjectId, ref: 'User' },
    defaultSupportManager: { type: Schema.ObjectId, ref: 'User' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    openingHours: { type: String },
    // available value of permissions:
    // 1 if all entities of contract's organization have permission
    // array of some entities of contract's organization which have permission
    permissions: { type: Schema.Types.Mixed, default: [] },
    demands: [ContractDemandSchema],
    software: [ContractSoftwareSchema],
    creation: { type: Date, default: Date.now },
    schemaVersion: { type: Number, default: 1 }
  });

  const ContractModel = mongoose.model('Contract', ContractSchema);

  ContractSchema.pre('save', function(next) {
    if (!uniqueDemands(this.demands)) {
      next(new Error('Invalid contract demands'));
    }

    return next();
  });

  return ContractModel;
};
