'use strict';

const { DEFAULT_LIST_OPTIONS, EVENTS } = require('../constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Organization = mongoose.model('Organization');
  const pubsubLocal = dependencies('pubsub').local;
  const search = require('./search')(dependencies);

  const organizationCreatedTopic = pubsubLocal.topic(EVENTS.ORGANIZATION.created);
  const organizationUpdatedTopic = pubsubLocal.topic(EVENTS.ORGANIZATION.updated);

  return {
    addUsersById,
    create,
    getById,
    getByShortName,
    getEntityByUserId,
    list,
    listByCursor,
    updateById,
    search,
    entitiesBelongsOrganization
  };

  /**
   * Create an organization
   * @param {Object}   organization - The organization object
   * @param {Promise}               - Resolve on success
   */
  function create(organization) {
    organization = organization instanceof Organization ? organization : new Organization(organization);

    return Organization.create(organization)
      .then(createdOrganization => {
        organizationCreatedTopic.publish(createdOrganization);

        return createdOrganization;
      });
  }

  /**
   * List organizations
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options) {
    options = options || {};

    const findOptions = options.parent ? { parent: mongoose.Types.ObjectId(options.parent) } : { parent: { $exists: false } };

    return Organization
      .find(findOptions)
      .populate('manager')
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-creation')
      .exec();
  }

  /**
   * Update an organization by ID
   * @param {String}   organizationId - The organization ID
   * @param {Object}   modified       - The modified organization object
   * @param {Promise}                 - Resolve on success with the number of documents selected for update
   */
  function updateById(organizationId, modified) {
    return Organization.update({ _id: organizationId }, { $set: modified }).exec()
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          modified._id = modified._id || organizationId;
          organizationUpdatedTopic.publish(modified);
        }

        return updatedResult.n;
      });
  }

  /**
   * Add users into sub-organization by ID.
   * @param {String} organizationId - The sub-organization ID
   * @param {Array}  userIds        - Array of user IDs will be added into sub-organization
   * @param {Promise}               - Resolve on success
   */
  function addUsersById(organizationId, userIds) {
    return Organization.update({ _id: organizationId }, { $addToSet: { users: { $each: userIds } } }).exec();
  }

  /**
   * Get an organization by ID
   * @param {String}   organizationId - The organization ID
   * @param {Promise}                 - Resolve on success
   */
  function getById(organizationId, options = {}) {
    const query = Organization.findById(organizationId);

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }

  /**
   * Get an organization by shortName
   * @param {String}   shortName - The organization shortName
   * @param {Promise}            - Resolve on success
   */
  function getByShortName(shortName) {
    return Organization.findOne({ shortName });
  }

  /**
   * Get entity by user ID.
   * @param {String}  userID - The user ID
   * @param {Promise}        - Resolve on success
   */
  function getEntityByUserId(userId) {
    return Organization.findOne({ users: userId, parent: { $exists: true } }).populate('parent').exec();
  }

  function listByCursor() {
    return Organization.find().cursor();
  }

  /**
   * Check if entities belong to an organization.
   * @param {Array}   entityIds      - Array of entity IDs
   * @param {String}  organizationId - Organization ID
   * @param {Promise}                - Resolve true if entities belong to organization, false otherwise
   */
  function entitiesBelongsOrganization(entityIds, organizationId) {
    return Organization.count({ _id: { $in: entityIds }, parent: organizationId }).exec()
      .then(count => count === entityIds.length);
  }
};
