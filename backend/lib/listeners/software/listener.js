'use strict';

module.exports = dependencies => {
  const { EVENTS, INDICES } = require('../../constants');
  const coreESListeners = dependencies('coreElasticsearch').listeners;
  const denormalize = require('./denormalize')(dependencies);

  return {
    getOptions,
    register
  };

  function getOptions() {
    return {
      events: {
        add: EVENTS.SOFTWARE.created,
        update: EVENTS.SOFTWARE.updated
      },
      denormalize: denormalize.denormalize,
      getId: denormalize.getId,
      type: INDICES.SOFTWARE.type,
      index: INDICES.SOFTWARE.name
    };
  }

  function register() {
    coreESListeners.addListener(getOptions());
  }
};
