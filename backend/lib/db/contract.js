'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const ContactSchema = new Schema({
    commercial: { type: String},
    technical: { type: String}
  }, { _id: false});

  const MailingListSchema = new Schema({
    internal: [String],
    external: [String]
  }, { _id: false});

  const ScheduleSchema = new Schema({
    start: { type: String },
    end: { type: String }
  }, { _id: false});

  const HumanResourcesSchema = new Schema({
    teams: [Schema.Types.Mixed],
    beneficiaries: [Schema.Types.Mixed]
  }, { _id: false});

  const SoftwareSchema = new Schema({
    name: { type: String },
    critical: { type: String, default: 'standard' },
    generic: Schema.Types.Mixed,
    technicalReferent: { type: String },
    os: { type: String },
    version: { type: String },
    SupportDate: ScheduleSchema
  }, { _id: false});

  const EngagementSectionSchema = new Schema({
    schedule: ScheduleSchema,
    engagements: [Schema.Types.Mixed]
  }, { _id: false});

  const EngagementsSchema = new Schema({
      critical: EngagementSectionSchema,
      sensible: EngagementSectionSchema,
      standard: EngagementSectionSchema
  }, { _id: false});

  const ContractSchema = new Schema({
    domain: { type: String},
    endDate: { type: Date, required: true },
    Engagements: EngagementsSchema,
    contact: ContactSchema,
    client: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, required: true},
    govern: { type: String},
    humanResources: HumanResourcesSchema,
    mailingList: MailingListSchema,
    name: { type: String, required: true},
    schedule: ScheduleSchema,
    status: { type: Boolean, default: true },
    startDate: { type: Date, required: true },
    software: [SoftwareSchema],
    timestamps: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    type: { type: String, default: 'credit'},
    schemaVersion: { type: Number, default: 1 }
  });

  const ContractModel = mongoose.model('Contract', ContractSchema);

  return ContractModel;
};
