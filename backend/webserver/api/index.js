'use strict';

const express = require('express');

module.exports = (dependencies, lib) => {

  const router = express.Router();

  require('./contract')(dependencies, lib, router);
  require('./contribution')(dependencies, lib, router);
  require('./organization')(dependencies, lib, router);
  require('./user')(dependencies, lib, router);
  require('./software')(dependencies, lib, router);
  require('./glossary')(dependencies, lib, router);
  require('./ticket')(dependencies, lib, router);
  require('./team')(dependencies, lib, router);
  require('./client')(dependencies, lib, router);
  require('./custom-filter')(dependencies, lib, router);
  require('./role')(dependencies, lib, router);
  require('./dashboard')(dependencies, lib, router);
  require('./filter')(dependencies, lib, router);
  require('./lininfosec')(dependencies, lib, router);

  return router;
};
