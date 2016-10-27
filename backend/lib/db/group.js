'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const ObjectId = mongoose.Schema.ObjectId;
  const GroupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    members: [{ type: ObjectId, ref: 'User' }]
  });

  return mongoose.model('TicGroup', GroupSchema);
};
