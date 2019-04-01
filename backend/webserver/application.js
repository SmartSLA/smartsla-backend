'use strict';

const express = require('express');

// This is you own express application
// eslint-disable-next-line no-unused-vars
module.exports = function(dependencies) {

  const application = express();

  // Every express new configuration are appended here.
  // This needs to be initialized before the body parser

  return application;
};
