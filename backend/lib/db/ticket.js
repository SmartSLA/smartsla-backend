'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;
  const CounterModel = mongoose.model('Counter');
  const { ContractSchema, ContractSoftwareSchema } = require('./schemas/contract')(dependencies);

  const IdNameEmail = {
    id: { type: String }, // ObjectId in string version
    name: { type: String }, // Display name
    email: { type: String }
  };

  const ticketSchema = new mongoose.Schema({
    _id: Number,
    assignedTo: IdNameEmail, // TODO Consider denormalizing
    author: IdNameEmail, // TODO Consider denormalizing
    beneficiary: IdNameEmail, // TODO Consider denormalizing
    contract: ContractSchema, // TODO Consider denormalizing
    comments: [Schema.Types.Mixed],
    description: { type: String },
    files: [Schema.Types.Mixed],
    idOssa: Schema.Types.Mixed,
    logs: [Schema.Types.Mixed],
    participants: [String],
    relatedRequests: [Schema.Types.Mixed], // FIXME Doesn't work in frontend
    responsible: IdNameEmail, // TODO Consider denormalizing
    severity: { type: String }, // TODO add enum validator
    software: ContractSoftwareSchema, // TODO Consider normalizing
    status: { type: String, default: 'new' }, // TODO add enum validator
    team: Schema.Types.Mixed, // FIXME Use real schema or Ref
    timestamps: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    title: { type: String, required: true },
    type: { type: String }, // TODO add enum validator
    schemaVersion: { type: Number, default: 1 }
  });

  ticketSchema.pre('save', function(next) {
    const self = this;

    if (this.isNew) {
      CounterModel.findOneAndUpdate(
          { _id: 'ticket' },
          { $inc: { seq: 1 }},
          { upsert: true, new: true },
          (err, sequence) => {
            if (err) {
              return next(err);
            }

            self._id = sequence.seq;

            next();
          });
    } else {
      next();
    }
  });

  ticketSchema.pre('findOneAndUpdate', function(next) {
    const self = this;
    const ticket = self._update.$set;

    ticket.timestamps.updatedAt = Date.now();

    next();
  });

  const TicketModel = mongoose.model('Ticket', ticketSchema);

  return TicketModel;
};
