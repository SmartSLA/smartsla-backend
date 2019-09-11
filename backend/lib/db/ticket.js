'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;
  const CounterModel = mongoose.model('Counter');

  const ticketSchema = new mongoose.Schema({
    assignedTo: Schema.Types.Mixed, // FIXME Use real schema or Ref
    author: Schema.Types.Mixed, // FIXME Use real schema or Ref
    contract: Schema.Types.Mixed, // FIXME Use real schema or Ref
    comments: [Schema.Types.Mixed],
    description: { type: String },
    files: [Schema.Types.Mixed],
    idOssa: Schema.Types.Mixed,
    logs: [Schema.Types.Mixed],
    participants: [String],
    relatedRequests: [Schema.Types.Mixed],
    responsible: Schema.Types.Mixed, // FIXME Use real schema or Ref
    severity: Schema.Types.Mixed, // FIXME Use real schema or Ref
    software: Schema.Types.Mixed, // FIXME Use real schema or Ref
    status: { type: String, default: 'New' },
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

  ticketSchema.pre('save', function(next) {
    const self = this;

    if (!this.ticketNumber) {
      CounterModel.findOneAndUpdate(
          { _id: 'ticket' },
          { $inc: { seq: 1 }},
          { upsert: true, new: true },
          (err, sequence) => {
            if (err) {
              return next(err);
            }

            self.ticketNumber = sequence.seq;

            next();
          });
    } else {
      next();
    }
  });

  const TicketModel = mongoose.model('Ticket', ticketSchema);

  return TicketModel;
};
