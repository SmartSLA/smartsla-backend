'use strict';

module.exports = dependencies => {
  const logger = dependencies('logger');
  const listener = require('./listener')(dependencies);
  let searchHandler;

  return {
    index,
    registerListener,
    remove
  };

  function index(organization, callback) {
    if (!searchHandler) {
      return callback(new Error('organizations search is not initialized'));
    }

    if (!organization) {
      return callback(new Error('organization is required'));
    }
    searchHandler.indexData(organization, callback);
  }

  function registerListener() {
    logger.info('Subscribing to organizations updates for indexing');
    searchHandler = listener.register();
  }

  function remove(organization, callback) {
    if (!searchHandler) {
      return callback(new Error('organizations search is not initialized'));
    }

    if (!organization) {
      return callback(new Error('organization is required'));
    }
    searchHandler.removeFromIndex(organization, callback);
  }
};
