'use strict';

module.exports = dependencies => {
  const logger = dependencies('logger');
  const listener = require('./listener')(dependencies);

  return {
    registerListener
  };

  function registerListener() {
    logger.info('Subscribing to ticket event for activity streams');
    listener.register();
  }
};
