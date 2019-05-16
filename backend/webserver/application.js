'use strict';

const express = require('express');
const cors = require('cors');

// This is you own express application
// eslint-disable-next-line no-unused-vars
module.exports = function(dependencies) {

  const application = express();

  application.all('/api/*', cors({ origin: true, credentials: true }));
  // Every express new configuration are appended here.
  // This needs to be initialized before the body parser

  return application;
};
