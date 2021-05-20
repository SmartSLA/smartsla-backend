'use strict';

const _ = require('lodash');

module.exports = function(dependencies) {
  const mongoose = dependencies('db').mongo.mongoose;
  const pubsubLocal = dependencies('pubsub').local;
  const Contribution = mongoose.model('Contribution');
  const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');
  const DEFAULT_CONTRIBUTION_POPULATES = [
    { path: 'software' }
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
      .lean()
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
    let findOptions = {};

    if (options.additional_filters) {
      findOptions = { ...setAdditionalOptions(options) };
    }

    return Contribution
      .find(findOptions)
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
      .update({ _id: contributionId}, { $set: { [statusKey]: stepValue}})
      .exec();
  }

  function setAdditionalOptions(options) {
    let additionalOptions = {};
    let statusOptions = {};

    if (options.additional_filters.software) {
      additionalOptions.software = { $in: _.map(options.additional_filters.software, 'id') };
    }

    if (options.additional_filters.type) {
      additionalOptions.type = { $in: _.map(options.additional_filters.type, 'id') };
    }

    if (options.additional_filters.author) {
      additionalOptions.author = { $in: _.map(options.additional_filters.author, 'id') };
    }

    if (options.additional_filters.status) {
      const statusIds = _.map(options.additional_filters.status, 'id');

      statusIds.forEach(step => {
        statusOptions = {...statusOptions, ...{ [`status.${step}`]: { $exists: 1, $ne: null} }};
      });

      additionalOptions = {...additionalOptions, ...statusOptions};
    }

    return additionalOptions;
  }
};
