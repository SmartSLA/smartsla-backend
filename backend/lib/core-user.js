'use strict';

const EVENTS = {
  userCreated: 'users:user:add'
};

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsub = dependencies('pubsub').local;
  const User = mongoose.model('User');

  return {
    deleteById
  };

  function deleteById(userId, callback) {
    return User.findByIdAndRemove(userId, (err, removedUser) => {
      if (!err && removedUser) {
        // remove data from ElasticSearch index
        pubsub.topic(EVENTS.userCreated).publish(removedUser);
      }

      callback(err, removedUser);
    });
  }
};
