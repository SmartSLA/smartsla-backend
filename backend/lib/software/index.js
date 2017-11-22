'use strict';

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsubLocal = dependencies('pubsub').local;
  const Software = mongoose.model('Software');
  const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');
  const search = require('./search')(dependencies);

  const softwareCreatedTopic = pubsubLocal.topic(EVENTS.SOFTWARE.created);
  const softwareUpdatedTopic = pubsubLocal.topic(EVENTS.SOFTWARE.updated);

  return {
    create,
    getById,
    getByName,
    list,
    listByCursor,
    search,
    updateById
  };

  /**
   * Create a software
   * @param {Object}  software - The software object
   * @param {Promise}          - Resolve on success
   */
  function create(software) {
    software = software instanceof Software ? software : new Software(software);

    return Software.create(software)
      .then(createdSoftware => {
        softwareCreatedTopic.publish(createdSoftware);

        return createdSoftware;
      });
  }

  /**
   * List software
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options = {}) {

    return Software
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }

  /**
   * Update a software by ID
   * @param {String}   softwareId - The software ID
   * @param {Object}   modified   - The modified software object
   * @param {Promise}             - Resolve on success with the number of documents selected for update
   */
  function updateById(softwareId, modified) {
    return Software.update({ _id: softwareId }, { $set: modified }).exec()
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          modified._id = modified._id || softwareId;
          softwareUpdatedTopic.publish(modified);
        }

        return updatedResult.n;
      });
  }

  /**
   * Get a software by name insensitive lowercase and uppercase
   * @param {String}   name - The software name
   * @param {Promise}       - Resolve on success
   */
  function getByName(name) {
    return Software.findOne({ name: new RegExp(`^${name}$`, 'i') });
  }

  /**
   * Get a software by ID
   * @param {String}   softwareId - The software ID
   * @param {Promise}             - Resolve on success
   */
  function getById(softwareId) {
    return Software
      .findById(softwareId)
      .exec();
  }

  /**
   * List software using cursor
   * @param {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return Software.find().cursor();
  }
};
