'use strict';

module.exports = function(dependencies, lib) {

  const helpers = require('../helpers');
  const _ = require('lodash');

  function getClientFromReq(req) {
    const client = {
      name: req.body.name,
      address: req.body.address,
      access_code: req.body.access_code,
      access_code_hint: req.body.access_code_hint,
      logo: req.body.logo
    };

     return _.omitBy(client, _.isUndefined);
  }

  function getClient(req, res) {
    res.status(200).json({client: req.client});
  }

  function listClients(req, res) {
    lib.client.list({}).then(
      function(result) {
        return res.status(200).json(result);
      },
      function(err) {
        return res.status(500).json(helpers.createErrorMessage(err, 'Error while listing clients'));
      }
    );
  }

  function createClient(req, res) {
    const client = getClientFromReq(req);

    lib.client.create(client).then(
      function(result) {
        return res.status(201).json(result);
      },
      function(err) {
        return res.status(500).json(helpers.createErrorMessage(err, 'Error while creating client'));
      }
    );
  }

  function updateClient(req, res) {
    const client = getClientFromReq(req);
    const clientId = {
      _id: req.params.clientId
    };

    lib.client.update(clientId, client).then(
      function(result) {
        return res.status(200).json(result);
      },
      function(err) {
        return res.status(500).json(helpers.createErrorMessage(err, 'Error while updating client'));
      }
    );
  }

  function removeClient(req, res) {
    const clientId = {
      _id: req.params.clientId
    };

    lib.client.remove(clientId).then(
      function() {
        return res.status(204).end();
      },
      function(err) {
        return res.status(500).json(helpers.createErrorMessage(err, 'Error while deleting client'));
      }
    );
  }

  return {
    getClient,
    listClients,
    createClient,
    updateClient,
    removeClient
  };
};
