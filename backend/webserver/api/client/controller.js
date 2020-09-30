'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);

  return {
    create,
    get,
    list,
    update,
    remove
  };

  /**
   * Create a client
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.client.create(req.body)
      .then(createdClient => res.status(201).json(createdClient))
      .catch(err => send500Error('Failed to create client', err, res));
  }

  /**
   * List clients
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let getClient;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search,
        excludedIds: req.query.excludedIds
      };

      errorMessage = 'Error while searching client';
      getClient = lib.client.search(options);
    } else if (req.query.name) {
      errorMessage = `Failed to get client ${req.query.name}`;
      getClient = lib.client.getByName(req.query.name)
        .then(client => {
          const list = client ? [client] : [];

          return {
            total_count: list.length,
            list
          };
        });
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset
      };

      errorMessage = 'Failed to list client';
      getClient = lib.client.list(options)
        .then(client => ({
          total_count: client.length,
          list: client
        }));
    }

    return getClient
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  /**
   * Get a client
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.client.getById(req.params.id)
      .then(client => res.status(200).json(client))
      .catch(err => send404Error(err.message, res));
  }

  /**
   * Update a client
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.client.updateById(req.params.id, req.body)
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('client not found', res);
      })
      .catch(err => send500Error('Failed to update client', err, res));
  }

  /**
   * Delete a client
   *
   * @param {Request} req
   * @param {Response} res
   */
  function remove(req, res) {
    return lib.client.removeById(req.params.id)
      .then(deletedClient => {
        if (deletedClient) {
          return res.status(204).end();
        }

        return send404Error('client not found', res);
      })
      .catch(err => send500Error('Failed to delete client', err, res));
  }
};
