'use strict';

const { FILTER_LIST } = require('./constants');

module.exports = {
    list,
    getById
};

/**
 * List filter
 * @return {Promise} - Resolve on success
 */
function list() {
  const filters = FILTER_LIST.map(({ _id, name }) => ({ _id, name }));

  return Promise.resolve(filters);
}

/**
 * Get a filter by ID.
 * @param  {String}   filterId - The filter ID
 * @return {Promise}  - Resolve the found filter
 */
function getById(filterId) {
  const filter = FILTER_LIST.find(filter => filter._id === filterId);

  return Promise.resolve(filter);
}
