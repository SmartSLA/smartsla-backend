'use strict';

const { EVENTS, INDICES } = require('../../constants');

module.exports = dependencies => {
  const coreESListeners = dependencies('coreElasticsearch').listeners;
  const denormalize = require('./denormalize')(dependencies);

  return {
    getOptions,
    register
  };

  function getOptions() {
    return {
      events: {
        add: EVENTS.USER.created,
        update: EVENTS.USER.updated,
        remove: EVENTS.USER.deleted
      },
      denormalize: denormalize.denormalize,
      getId: denormalize.getId,
      type: INDICES.USER.type,
      index: INDICES.USER.name
    };
  }

  function register() {
    coreESListeners.addListener(getOptions());
  }
};
