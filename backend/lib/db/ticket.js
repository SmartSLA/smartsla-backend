'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;
  const CounterModel = mongoose.model('Counter');
  const { ContractSoftwareSchema } = require('./schemas/contract')(dependencies);

  const Attachment = {
    id: { type: Schema.Types.ObjectId },
    mimeType: { type: String },
    name: { type: String }
  };

  const IdNameEmailType = {
    id: { type: String }, // ObjectId in string version
    name: { type: String }, // Display name
    email: { type: String },
    type: { type: String },
    phone: { type: String }
  };

  const Changes = {
    field: {type: String},
    oldValue: {type: String},
    newValue: {type: String},
    action: {type: String}
  };

  const Event = {
    author: IdNameEmailType,
    target: IdNameEmailType,
    beneficiary: IdNameEmailType,
    responsible: IdNameEmailType,
    status: { type: String },
    comment: { type: String },
    timestamps: {
      createdAt: {type: Date, default: Date.now}
    },
    attachments: [Attachment],
    changes: [Changes],
    isPrivate: {type: Boolean, default: false},
    isSurvey: {type: Boolean, default: false}
  };

  const Survey = {
    id: { type: Number },
    token: { type: String }
  };

  const ticketSchema = new mongoose.Schema({
    _id: Number,
    assignedTo: IdNameEmailType, // TODO Consider denormalizing
    author: IdNameEmailType, // TODO Consider denormalizing
    beneficiary: IdNameEmailType, // TODO Consider denormalizing
    callNumber: { type: String },
    contract: { type: mongoose.Schema.ObjectId, ref: 'Contract', required: true }, // TODO Consider denormalizing
    createdDuringBusinessHours: { type: Boolean, default: true },
    description: { type: String },
    events: [Event],
    idOssa: Schema.Types.Mixed,
    meetingId: { type: String },
    participants: [String],
    relatedRequests: [Schema.Types.Mixed], // FIXME Doesn't work in frontend
    relatedContributions: [{type: Number, ref: 'Contribution'}],
    responsible: IdNameEmailType, // TODO Consider denormalizing
    severity: { type: String }, // TODO add enum validator
    software: ContractSoftwareSchema, // TODO Consider normalizing and rename field to supportedSoftware
    status: { type: String, default: 'new' }, // TODO add enum validator
    survey: Survey,
    team: Schema.Types.Mixed, // FIXME Use real schema or Ref
    timestamps: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    archived: { type: Boolean, default: false },
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
    const set = self._update.$set || {};

    if (set.timestamps) {
      set.timestamps.updatedAt = Date.now();
    } else {
      self._update.$set = Object.assign(set, { 'timestamps.updatedAt': Date.now() });
    }

    next();
  });

  const TicketModel = mongoose.model('Ticket', ticketSchema);

  return TicketModel;
};
