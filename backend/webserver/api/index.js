'use strict';

const express = require('express');

module.exports = (dependencies, lib) => {

  const router = express.Router();

  require('./contract')(dependencies, lib, router);
  require('./organization')(dependencies, lib, router);
  require('./user')(dependencies, lib, router);
  require('./software')(dependencies, lib, router);
  require('./glossary')(dependencies, lib, router);

  return router;
};
