'use strict';

const express = require('express');

module.exports = function(dependencies, lib) {

  const router = express.Router();

  require('./contract')(dependencies, lib, router);
  require('./organization')(dependencies, lib, router);

  return router;
};
