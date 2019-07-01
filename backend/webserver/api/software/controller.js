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
   * Create a software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.software.create(req.body)
      .then(createdSoftware => res.status(201).json(createdSoftware))
      .catch(err => send500Error('Failed to create software', err, res));
  }

  /**
   * list software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let getSoftware;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search,
        excludedIds: req.query.excludedIds
      };

      errorMessage = 'Error while searching software';
      getSoftware = lib.software.search(options);
    } else if (req.query.name) {
      errorMessage = `Failed to get software ${req.query.name}`;
      getSoftware = lib.software.getByName(req.query.name)
        .then(software => {
          const list = software ? [software] : [];

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

      errorMessage = 'Failed to list software';
      getSoftware = lib.software.list(options)
        .then(software => ({
          total_count: software.length,
          list: software
        }));
    }

    return getSoftware
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  /**
   * Get a software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.software.getById(req.params.id)
      .then(software => {
        software = software.toObject();

        return res.status(200).json(software);

      })
      .catch(err => send500Error('Failed to get software', err, res));
  }

  /**
   * Update a software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.software.updateById(req.params.id, req.body)
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('Software not found', res);
      })
      .catch(err => send500Error('Failed to update software', err, res));
  }

  /**
   * Delete a software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function remove(req, res) {
    return lib.software.removeById(req.params.id)
      .then(deletedSoftware => {
        if (deletedSoftware) {
          return res.status(204).end();
        }

        return send404Error('software not found', res);
      })
      .catch(err => send500Error('Failed to delete software', err, res));
  }
};
