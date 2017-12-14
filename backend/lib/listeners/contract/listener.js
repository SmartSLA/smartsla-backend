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
        add: EVENTS.CONTRACT.created,
        update: EVENTS.CONTRACT.updated
      },
      denormalize: denormalize.denormalize,
      getId: denormalize.getId,
      type: INDICES.CONTRACT.type,
      index: INDICES.CONTRACT.name
    };
  }

  function register() {
    coreESListeners.addListener(getOptions());
  }
};
