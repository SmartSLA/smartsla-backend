'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;
  const CounterModel = mongoose.model('Counter');
  const { ContractSchema, ContractSoftwareSchema } = require('./schemas/contract')(dependencies);

  const Attachment = {
    id: { type: Schema.Types.ObjectId },
    mimeType: { type: String },
    name: { type: String }
  };

  const IdNameEmailType = {
    _id: Schema.Types.Mixed, // FIXME ids are inconsistant in UI, should be fixed
    id: { type: String }, // ObjectId in string version
    name: { type: String }, // Display name
    email: { type: String },
    type: { type: String }
  };

  const Event = {
    author: {
      id: { type: String },
      name: { type: String },
      image: { type: String }
    },
    target: IdNameEmailType, // this can be assigned to a Team, a Group, a User, anything...
    status: { type: String },
    comment: { type: String },
    timestamps: {
      createdAt: {type: Date, default: Date.now}
    },
    attachments: [Attachment]
  };

  const ticketSchema = new mongoose.Schema({
    _id: Number,
    assignedTo: IdNameEmailType, // TODO Consider denormalizing
    author: IdNameEmailType, // TODO Consider denormalizing
    beneficiary: IdNameEmailType, // TODO Consider denormalizing
    contract: ContractSchema, // TODO Consider denormalizing
    description: { type: String },
    events: [Event],
    idOssa: Schema.Types.Mixed,
    participants: [String],
    relatedRequests: [Schema.Types.Mixed], // FIXME Doesn't work in frontend
    responsible: IdNameEmailType, // TODO Consider denormalizing
    severity: { type: String }, // TODO add enum validator
    software: ContractSoftwareSchema, // TODO Consider normalizing and rename field to supportedSoftware
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

    if (ticket.timestamps) {
      ticket.timestamps.updatedAt = Date.now();
    }

    next();
  });

  const TicketModel = mongoose.model('Ticket', ticketSchema);

  return TicketModel;
};
