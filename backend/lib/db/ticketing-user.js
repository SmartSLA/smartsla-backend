'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TicketingUserSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'beneficiary' },
    name: { type: String },
    position: { type: String },
    phone: { type: String },
    identifier: { type: String },
    role: { type: String },
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  return mongoose.model('TicketingUser', TicketingUserSchema);
};
