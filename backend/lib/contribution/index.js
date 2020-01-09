'use strict';

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsubLocal = dependencies('pubsub').local;
  const Contribution = mongoose.model('Contribution');
  const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');
  const DEFAULT_CONTRIBUTION_POPULATES = [
    { path: 'software' },
    { path: 'author'}
  ];
  const contributionCreatedTopic = pubsubLocal.topic(EVENTS.CONTRIBUTION.created);
  const contributionUpdatedTopic = pubsubLocal.topic(EVENTS.CONTRIBUTION.updated);
  const contributionDeletedTopic = pubsubLocal.topic(EVENTS.CONTRIBUTION.deleted);

  return {
    create,
    getById,
    list,
    updateById,
    removeById
  };

  /**
   * Create a contribution
   * @param {Object} contribution - the contribution object
   * @param {Pormise}             - resolve on success
   */
  function create(contribution) {
    contribution = contribution instanceof Contribution ? contribution : new Contribution(contribution);

    return Contribution.create(contribution)
      .then(createdContribution => {
        contributionCreatedTopic.publish(createdContribution);

        return createdContribution;
      });
  }

  /**
   * Fetch a contribution
   * @param {String} contributionId - the contribution id
   * @param {Promise}               - resolve on success
   */
  function getById(contributionId) {
    return Contribution
      .findById(contributionId)
      .populate(DEFAULT_CONTRIBUTION_POPULATES)
      .exec();
  }

  /**
   * Update a contribution
   * @param {String} contributionId - the contribution id
   * @param {Object} modified       - the modified contribution
   * @param {Promise}               - resolve on success
   */
  function updateById(contributionId, modified) {
    return Contribution
      .update({ _id: contributionId}, { $set: modified})
      .exec()
      .then(result => {
        if (result.n) {
          modified._id = modified._id || contributionId;
          contributionUpdatedTopic.publish(modified);
        }

        return result.n;
      });
  }

  /**
   * Remove a contribution
   * @param {String} contributionId - the contribution id
   * @param {resolve}               - resolve on success
   */
  function removeById(contributionId) {
    return Contribution
      .findByIdAndRemove(contributionId)
      .then(deletedcontribution => {
        if (deletedcontribution) {
          contributionDeletedTopic.publish(deletedcontribution);
        }

        return deletedcontribution;
      });
  }

  /**
   * List contributions
   * @param {Object} Options  - the options object (offset and limit)
   * @param {resolve}         - resolve on success
   */
  function list(options = {}) {
    return Contribution
      .find()
      .populate(DEFAULT_CONTRIBUTION_POPULATES)
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-timestamps.creation')
      .exec();
  }
};
