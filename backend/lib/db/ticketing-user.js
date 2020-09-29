'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TicketingUserSchema = new mongoose.Schema({
    identifier: { type: String },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    jobTitle: {type: String},
    client: { type: mongoose.Schema.ObjectId, ref: 'Client'},
    // The role must be kept here in case the type is "expert" just because we do not have any other place to store it
    role: { type: String },
    timestamps: {
      createdAt: { type: Date, default: Date.now }
    },
    // "beneficiary" (ie customer) or "expert" (ie support)
    type: { type: String, default: 'beneficiary' },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    schemaVersion: { type: Number, default: 1 }
  });

  return mongoose.model('TicketingUser', TicketingUserSchema);
};
