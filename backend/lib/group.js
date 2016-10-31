'use strict';

module.exports = function(dependencies) {

  const mongoose = dependencies('db').mongo.mongoose;
  const Group = mongoose.model('TicGroup');

  function create(group) {
    return Group.create(group);
  }

  function get(id) {
    return Group.findById(id).exec();
  }

  function list(options) {
    return Group.find(options).exec();
  }

  function update(id, group) {
    return Group.findByIdAndUpdate(id, {$set: group}, {new: true}).exec();
  }

  function remove(id) {
    return Group.findByIdAndRemove(id).exec();
  }

  return {
    create,
    get,
    list,
    update,
    remove
  };
};
