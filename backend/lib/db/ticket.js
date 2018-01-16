'use strict';

const { TICKET_STATES } = require('../constants');
const { validateTicketState } = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const TicketSoftwareSchema = new Schema({
    template: { type: Schema.ObjectId, ref: 'Software', required: true },
    criticality: { type: String, required: true },
    version: { type: String, required: true }
  }, { _id: false });

  const TicketTimeSchema = new Schema({
    responseTime: { type: Number, min: 1 }, // in minute
    workaroundTime: { type: Number, min: 1 }, // in minute
    correctionTime: { type: Number, min: 1 }, // in minute
    suspendedAt: Date, // moment when suspend ticket
    suspendTime: { type: Number, min: 0, default: 0 } // in minute, cumulated when ticket is changed from suspended state to "In progress" state
                                                      // used when calculate workaroundTime and correctionTime
  }, { _id: false });

  const TicketSchema = new Schema({
    title: { type: String, required: true, trim: true },
    number: { type: Number, unique: true },
    contract: { type: Schema.ObjectId, ref: 'Contract', required: true },
    demandType: { type: String, required: true },
    severity: String,
    software: TicketSoftwareSchema,
    description: { type: String, required: true, trim: true, minlength: 50 },
    environment: { type: String, trim: true },
    requester: { type: Schema.ObjectId, ref: 'User', required: true },
    supportManager: { type: Schema.ObjectId, ref: 'User', required: true },
    supportTechnicians: [{ type: Schema.ObjectId, ref: 'User' }],
    attachments: [Schema.ObjectId],
    state: { type: String, default: TICKET_STATES.NEW, validate: [validateTicketState, 'Invalid ticket state'] },
    times: TicketTimeSchema,
    schemaVersion: { type: Number, default: 1 }
  }, {
    timestamps: { createdAt: 'creation' }
  });

  const TicketModel = mongoose.model('Ticket', TicketSchema);

  function _validateTimes(times) {
    if (times && times.workaroundTime && times.responseTime && times.workaroundTime < times.responseTime) {
      return new Error('workaroundTime can NOT be smaller than responseTime');
    }

    if (times && times.correctionTime && times.responseTime && times.correctionTime < times.responseTime) {
      return new Error('correctionTime can NOT be smaller than responseTime');
    }

    if (times && times.correctionTime && times.workaroundTime && times.correctionTime < times.workaroundTime) {
      return new Error('correctionTime can NOT be smaller than workaroundTime');
    }
  }

  TicketSchema.pre('save', function(next) {
    const self = this;

    const timesError = _validateTimes(self.times);

    if (timesError) {
      return next(timesError);
    }

    if (!self.isNew) {
      return next();
    }

    // ticket number auto-increment
    TicketModel.findOne({}, {}, { sort: { number: -1 } }, (err, ticket) => {
      if (err) {
        return next(err);
      }

      self.number = ticket ? ticket.number + 1 : 1;

      next();
    });
  });

  return TicketModel;
};
