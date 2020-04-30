'use strict';

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsubLocal = dependencies('pubsub').local;
  const CustomFilter = mongoose.model('CustomFilter');
  const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');

  const filterCreatedTopic = pubsubLocal.topic(EVENTS.FILTER.created);
  const filterUpdatedTopic = pubsubLocal.topic(EVENTS.FILTER.updated);
  const filterDeletedTopic = pubsubLocal.topic(EVENTS.FILTER.deleted);

  return {
    create,
    getById,
    list,
    listByCursor,
    updateById,
    removeById
  };

  /**
   * Create a custom filter
   * @param {Object}  customFilter    - The custom filter object
   * @return {Promise}                - Resolve on success
   */
  function create(customFilter) {
    customFilter = customFilter instanceof CustomFilter ? customFilter : new CustomFilter(customFilter);

    return CustomFilter.create(customFilter)
      .then(createdCustomFilter => {
        filterCreatedTopic.publish(createdCustomFilter);

        return createdCustomFilter;
      });
  }

  /**
   * List custom filters
   * @param {Object}   options   - The options object, may contain offset and limit
   * @return {Promise}           - Resolve on success
   */
  function list(options = {}) {

    return CustomFilter
      .find({ user: options.user })
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }

  /**
   * Update a custom filter by ID
   * @param {String}   customFilterId - The filter ID
   * @param {Object}   modified       - The modified custom filter object
   * @return {Promise}                -  Resolve on success with the number of documents selected for update
   */
  function updateById(customFilterId, modified) {
    return CustomFilter.update({ _id: customFilterId }, { $set: modified }).exec()
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          modified._id = modified._id || customFilterId;
          filterUpdatedTopic.publish(modified);
        }

        return updatedResult.n;
      });
  }

  /**
   * Get a custom filter by ID
   * @param {String}   customFilterId - The filter ID
   * @return {Promise}                 - Resolve on success
   */
  function getById(customFilterId) {
    return CustomFilter
      .findById(customFilterId)
      .exec();
  }

  /**
   * List custom filter using cursor
   * @return {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return CustomFilter.find().cursor();
  }

  /**
  * Remove custom filter by ID
  * @param {String}   customFilterId - The custom filter ID
  * @return {Promise}                - Resolve on success
  */
  function removeById(customFilterId) {
    return CustomFilter
      .findByIdAndRemove(customFilterId)
      .then(deletedCustomFilter => {
        if (deletedCustomFilter) {
          filterDeletedTopic.publish(deletedCustomFilter);
        }

        return deletedCustomFilter;
      });
  }
};
