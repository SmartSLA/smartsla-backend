'use strict';

const { DEFAULT_LIST_OPTIONS } = require('../constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Organization = mongoose.model('Organization');
  const search = require('./search')(dependencies);

  return {
    addUsersById,
    create,
    getById,
    getByShortName,
    getSubOrganizationByUserId,
    list,
    listByCursor,
    updateById,
    search
  };

  /**
   * Create an organization
   * @param {Object}   organization - The organization object
   * @param {Promise}               - Resolve on success
   */
  function create(organization) {
    organization = organization instanceof Organization ? organization : new Organization(organization);

    return Organization.create(organization);
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
   * @param {Promise}                 - Resolve on success
   */
  function updateById(organizationId, modified) {
    return Organization.update({ _id: organizationId }, { $set: modified }).exec();
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
  function getById(organizationId) {
    return Organization
      .findById(organizationId)
      .populate('manager')
      .populate('parent')
      .populate('users')
      .exec();
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
   * Get sub organization by user ID.
   * @param {String}  userID - The user ID
   * @param {Promise}        - Resolve on success
   */
  function getSubOrganizationByUserId(userId) {
    return Organization.findOne({ users: userId, parent: { $exists: true } }).populate('parent').exec();
  }

  function listByCursor() {
    return Organization.find().cursor();
  }
};
