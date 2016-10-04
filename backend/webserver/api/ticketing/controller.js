'use strict';

let logger, core;

function getHomeTicketing(req, res) {
  logger.info('My module controller says Welcome in ticketing platform!');

  return res.status(200).json({message: core.getTicketing(), user: req.user});
}

module.exports = function(dependencies) {
  logger = dependencies('logger');
  core = require('./core')(dependencies);

  return {
    getHomeTicketing
  };
};
