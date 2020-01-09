'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const ContributionSchema = require('./schemas/contribution')(dependencies);

  return mongoose.model('Contribution', ContributionSchema);
};
