'use strict';

const { FILTER_LIST } = require('./constants');
const { parseQuery, populateFilteryQueryTemplate } = require('./helpers');

module.exports = {
    list,
    getById
};

/**
 * List filter
 * @return {Promise} - Resolve on success
 */
function list({ticketingUser}) {
  const { type } = ticketingUser;
  const filters = FILTER_LIST.filter(filter => {
    if (filter.rights && !filter.rights.includes(type)) {
      return false;
    }

    return true;
  }).map(({ _id, name }) => ({ _id, name }));

  return Promise.resolve(filters);
}

/**
 * Get a filter by ID.
 * @param  {String}   filterId - The filter ID
 * @return {Promise}  - Resolve the found filter
 */
function getById(filterId, values = {}) {
  const filter = FILTER_LIST.find(filter => filter._id === filterId);

  if (filter && filter.query) {

    const templateParams = parseQuery(filter.query);
    const paramValues = templateParams.map(param => ({
      key: param,
      value: values[param] || ''
    }));

    filter.query = populateFilteryQueryTemplate(filter.query, paramValues);
  }

  return Promise.resolve(filter);
}
