'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TicketingUserSchema = new mongoose.Schema({
    identifier: { type: String },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    position: { type: String },
    role: { type: String },
    timestamps: {
      createdAt: { type: Date, default: Date.now }
    },
    type: { type: String, default: 'beneficiary' },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    schemaVersion: { type: Number, default: 1 }
  });

  return mongoose.model('TicketingUser', TicketingUserSchema);
};
