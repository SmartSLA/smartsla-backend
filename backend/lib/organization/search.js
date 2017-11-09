'use strict';

const _ = require('lodash');
const Q = require('q');
const { DEFAULT_LIST_OPTIONS } = require('../constants');

module.exports = dependencies => {

  const coreElasticsearch = dependencies('coreElasticsearch');
  const INDEX = {
    type: 'organizations',
    name: 'organizations.idx'
  };

  return search;

  /**
   * Search organization in system.
   *
   * @param {object} options - Hash with:
   * - 'limit' and 'offset' for pagination
   * - 'search' for filtering terms
   * Search can be a single string, an array of strings which will be joined, or a space separated string list.
   *  In the case of array or space separated string, a AND search will be performed with the input terms.
   * @return {Promise} Resolve on success with result: { total_count: number, list: [Organization1, Organization2, ...] }
   */
  function search(options) {
    return Q.nfcall(_search, options);
  }

  function _search(options, callback) {
    options.limit = +options.limit || DEFAULT_LIST_OPTIONS.LIMIT;
    options.offset = +options.offset || DEFAULT_LIST_OPTIONS.OFFSET;

    if (!options.search) {
      return callback(new Error('query.search is mandatory'));
    }

    return coreElasticsearch.client((err, elascticsearchClient) => {
      if (err) {
        return callback(err);
      }

      const terms = (options.search instanceof Array) ? options.search.join(' ') : options.search;

      const elasticsearchQuery = {
        sort: [
          {'shortName.sort': 'asc'}
        ],
        query: {
          bool: {
            must: {
              multi_match: {
                query: terms,
                type: 'cross_fields',
                fields: ['shortName', 'fullName', 'description'],
                operator: 'and'
              }
            }
          }
        }
      };

      return elascticsearchClient.search({
        index: INDEX.name,
        type: INDEX.type,
        from: options.offset,
        size: options.limit,
        body: elasticsearchQuery
      }, (err, response) => {
        if (err) {
          return callback(err);
        }

        const list = response.hits.hits;
        const organizations = list.map(function(hit) { return _.extend(hit._source, { _id: hit._source.id }); });

        return callback(null, {
          total_count: response.hits.total,
          list: organizations
        });
      });
    });
  }
};
