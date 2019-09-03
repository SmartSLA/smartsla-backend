'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const ticketSchema = new mongoose.Schema({
    assignTo: Schema.Types.Mixed, // FIXME Use real schema or Ref
    author: Schema.Types.Mixed, // FIXME Use real schema or Ref
    contract: Schema.Types.Mixed, // FIXME Use real schema or Ref
    comments: [Schema.Types.Mixed],
    description: { type: String },
    files: [Schema.Types.Mixed],
    idOssas: { type: Number, default: 1 },
    logs: [Schema.Types.Mixed],
    participants: [String],
    relatedRequests: [Schema.Types.Mixed],
    responsible: Schema.Types.Mixed, // FIXME Use real schema or Ref
    severity: Schema.Types.Mixed, // FIXME Use real schema or Ref
    software: Schema.Types.Mixed, // FIXME Use real schema or Ref
    status: { type: String },
    team: Schema.Types.Mixed, // FIXME Use real schema or Ref
    ticketNumber: { type: Number },
    timestamps: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    title: { type: String, required: true },
    type: Schema.Types.Mixed,
    schemaVersion: { type: Number, default: 1 }
  });

  const TicketModel = mongoose.model('Ticket', ticketSchema);

  return TicketModel;
};
