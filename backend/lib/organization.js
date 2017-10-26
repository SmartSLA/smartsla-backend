'use strict';

const { DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Organization = mongoose.model('Organization');

  return {
    create,
    getById,
    list,
    updateById
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

    return Organization
      .find({ parent: { $exists: false } })
      .populate('administrator')
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
   * Get an organization by ID
   * @param {String}   organizationId - The organization ID
   * @param {Promise}                 - Resolve on success
   */
  function getById(organizationId) {
    return Organization.findById(organizationId).exec();
  }
};
