'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const ScheduleSchema = new Schema({
    start: { type: String },
    end: { type: String }
  }, { _id: false });

  const SoftwareSchema = new Schema({
    name: { type: String },
    critical: { type: String, default: 'standard' },
    generic: Schema.Types.Mixed,
    technicalReferent: { type: String },
    os: { type: String },
    version: { type: String },
    SupportDate: ScheduleSchema
  }, { _id: false });

  const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contract: Schema.Types.Mixed,
    participants: [String],
    type: { type: String },
    severity: { type: String },
    description: { type: String },
    software: SoftwareSchema,
    relatedRequests: [Schema.Types.Mixed],
    status: { type: String},
    responsible: Schema.Types.Mixed,
    author: Schema.Types.Mixed,
    comments: [Schema.Types.Mixed],
    files: [Schema.Types.Mixed],
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  const TicketModel = mongoose.model('Ticket', ticketSchema);

  return TicketModel;
};
