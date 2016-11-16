'use strict';

const express = require('express');

module.exports = function(dependencies, lib) {

  const router = express.Router();

  require('./client')(dependencies, lib, router);
  require('./group')(dependencies, lib, router);

  return router;
};
