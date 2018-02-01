'use strict';

module.exports = dependencies => {
  const logger = dependencies('logger');
  const listener = require('./listener')(dependencies);

  return {
    registerListener
  };

  function registerListener() {
    logger.info('Subscribing to user update for indexing');
    listener.register();
  }
};
