'use strict';

module.exports = function(dependencies, lib) {

  const helpers = require('../helpers');

  function loadClient(req, res, next, clientId) {
    lib.client.get(clientId).then(
      function(client) {
        if (!client) {
          res.status(404).json({
            error: {
              code: 404,
              message: 'Not found',
              details: 'Can not find client'
            }
          });
        }
        req.client = client;
        next();
      },
      function(err) {
        return res.status(500).json(helpers.createErrorMessage(err, 'Error while loading client'));
      }
    );
  }

  return {
    loadClient
  };
};
