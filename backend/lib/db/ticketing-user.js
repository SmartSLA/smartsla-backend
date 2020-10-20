'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingUserSchema = require('./schemas/ticketingUser')(dependencies);

  return mongoose.model('TicketingUser', TicketingUserSchema);
};
