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
    updateStatus,
    removeById
  };

  /**
   * Create a contribution
   * @param {Object} contribution - the contribution object
   * @return {Promise}             - resolve on success
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
   * @return {Promise}              - resolve on success
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
   * @return {Promise}              - resolve on success
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
   * @return {resolve}               - resolve on success
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
   * @return {resolve}         - resolve on success
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

  /**
   * Update contribution status
   * @param {String} contributionId - the contribution id
   * @param {Object} option         - the { stepName, stepValue } value
   * @return {Promise}             - resolve on success
   */
  function updateStatus(contributionId, {stepName, stepValue = ''}) {
    const statusKey = `status.${stepName}`;

    return Contribution
      .findByIdAndUpdate(contributionId, { $set: { [statusKey]: stepValue}})
      .exec();
  }
};
