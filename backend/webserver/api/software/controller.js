'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);

  return {
    create,
    list,
    update
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
   * List software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    return lib.software.list(options)
      .then(software => {
        res.header('X-ESN-Items-Count', software.length);
        res.status(200).json(software);
      })
      .catch(err => send500Error('Failed to list software', err, res));
  }

  /**
   * Update a software
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.software.updateById(req.params.id, req.body)
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          return res.status(204).end();
        }

        return send404Error('Software not found', res);
      })
      .catch(err => send500Error('Failed to update software', err, res));
  }
};
