'use strict';

const express = require('express');

module.exports = function(dependencies) {

  const controller = require('./controller')(dependencies);
  const middleware = require('./middleware')(dependencies);

  const router = express.Router();

  router.get('/ticketing', middleware.passThrough, controller.getHomeTicketing);

  return router;
};
