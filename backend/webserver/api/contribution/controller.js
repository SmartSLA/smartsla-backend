'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const logger = dependencies('logger');

  return {
    create,
    get,
    list,
    update,
    updateStatus,
    remove
  };

  /**
   * Create a contribution
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.contribution.create(req.body)
      .then(createdContribution => res.status(201).json(createdContribution))
      .catch(err => send500Error('Failed to create contribution', err, res));
  }

  /**
   * list contributions
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    if (req.query.a) {
      options.additional_filters = getAdditionalParams(req);
    }

    lib.contribution.list(options).then(list => {
      res.header('X-ESN-Items-Count', list.length);
      res.status(200).json(list);
    })
      .catch(err => send500Error('Error while getting contributions', err, res));
  }

  /**
   * get contribution
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.contribution.getById(req.params.id)
      .then(contribution => {
        if (contribution) {
          res.status(200).json(contribution);
        }

        return send404Error('contribution not found', res);
      })
      .catch(err => send500Error('Error while getting contribution', err, res));
  }

  /**
   * update contributions
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.contribution.updateById(req.params.id, req.body)
      .then(updatedContribution => {
        if (updatedContribution) {
          res.status(204).end();
        }

        return send404Error('contribution not found', res);
      })
      .catch(err => send500Error('Error while updating contribution', err, res));
  }

  /**
   * update contribution status
   *
   * @param {Request} req
   * @param {Response} res
   */
  function updateStatus(req, res) {
    return lib.contribution
      .updateStatus(req.params.id, req.body)
      .then(updated => {
        if (updated) {
          res.status(204).end();
        }

        return send404Error('contribution not found', res);
      })
      .catch(err => send500Error('Error while updating contribution status', err, res));
  }

  /**
   * remove contribution
   *
   * @param {Request} req
   * @param {Response} res
   */
  function remove(req, res) {
    return lib.contribution.removeById(req.params.id)
      .then(deleted => {
        if (deleted) {
          res.status(204).end();
        }

        return send404Error('contribution not found', res);
      })
      .catch(err => send500Error('Error while removing contribution', err, res));
  }

  function getAdditionalParams({query}) {
    let filters = {};

    try {
      filters = JSON.parse(query.a);
    } catch (e) {
      logger.error('Unable to parse additional filters parameters', e);
    }

    return filters;
  }
};
