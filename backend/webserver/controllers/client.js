'use strict';

module.exports = function(dependencies, lib) {

  const helpers = require('../helpers');
  const _ = require('lodash');
  const q = require('q');

  function getClientFromReq(req) {
    const client = {
      name: req.body.name,
      acronym: req.body.acronym,
      preferred_contact: req.body.preferred_contact,
      address: req.body.address,
      is_active: req.body.is_active,
      access_code: req.body.access_code,
      access_code_hint: req.body.access_code_hint,
      groups: req.body.groups,
      logo: req.body.logo
    };

     return _.omitBy(client, _.isUndefined);
  }

  function getClient(req, res) {
    res.status(200).json(req.client);
  }

  function listClients(req, res) {
    lib.client.list({}).then(
      result => res.status(200).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while listing clients'))
    );
  }

  function createClient(req, res) {
    const client = getClientFromReq(req);

    lib.client.create(client).then(
      result => res.status(201).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while creating client'))
    );
  }

  function updateClient(req, res) {
    const client = getClientFromReq(req);
    const clientId = {
      _id: req.params.clientId
    };

    lib.client.update(clientId, client).then(
      result => res.status(200).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while updating client'))
    );
  }

  function removeClient(req, res) {
    const clientId = {
      _id: req.params.clientId
    };

    lib.client.remove(clientId)
    .then(
      result => {
        const groups = result.groups;

        if (groups.length) {
          return q.all(
            groups.map(
              group => lib.group.remove(group)
            )
          );
        }

        return result;
      }
    )
    .then(
      result => res.status(204).json(result),
      err => res.status(500).json(helpers.createErrorMessage(err, 'Error while deleting client'))
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
