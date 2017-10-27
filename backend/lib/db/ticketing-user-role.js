'use strict';

const { validateUserRole } = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TicketingUserRoleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, validate: [validateUserRole, 'Invalid TicketingUser role'] },
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    schemaVersion: { type: Number, default: 1 }
  });

  return mongoose.model('TicketingUserRole', TicketingUserRoleSchema);
};
