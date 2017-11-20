'use strict';

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const Software = mongoose.model('Software');
  const { DEFAULT_LIST_OPTIONS } = require('./constants');

  return {
    create,
    getById,
    getByName,
    list,
    updateById
  };

  /**
   * Create a software
   * @param {Object}  software - The software object
   * @param {Promise}          - Resolve on success
   */
  function create(software) {
    software = software instanceof Software ? software : new Software(software);

    return Software.create(software);
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
   * @param {Promise}             - Resolve on success
   */
  function updateById(softwareId, modified) {
    return Software.update({ _id: softwareId }, { $set: modified }).exec();
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
};
