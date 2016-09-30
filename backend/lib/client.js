'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const Client = mongoose.model('TicClient');

  function create(client) {
    return Client.create(client);
  }

  function get(id) {
    return Client.findById(id).exec();
  }

  function list(options) {
    return Client.find(options).exec();
  }

  function update(id, client) {
    return Client.findByIdAndUpdate(id, {$set: client}, {new: true}).exec();
  }

  function remove(id) {
    return Client.findByIdAndRemove(id).exec();
  }

  return {
    create,
    get,
    list,
    update,
    remove
  };
};
