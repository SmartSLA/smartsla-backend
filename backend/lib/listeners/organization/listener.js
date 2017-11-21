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
        add: EVENTS.ORGANIZATION.created,
        update: EVENTS.ORGANIZATION.updated
      },
      denormalize: denormalize.denormalize,
      getId: denormalize.getId,
      type: INDICES.ORGANIZATION.type,
      index: INDICES.ORGANIZATION.name
    };
  }

  function register() {
    coreESListeners.addListener(getOptions());
  }
};
