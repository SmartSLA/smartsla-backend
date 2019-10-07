'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TicketingUserSchema = new mongoose.Schema({
    identifier: { type: String },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    // TODO: Must be moved to user-contract link
    // Value depends on this.type
    // if (type === "beneficiary") => "customer" or "viewer"
    // if (type === "expert") => "manager" or "expert"
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
