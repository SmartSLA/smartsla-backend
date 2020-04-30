'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error, send403Error } = require('../utils')(dependencies);

  return {
    create,
    get,
    list,
    update,
    remove
  };

  /**
   * Create a new custom filter
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.customFilter.create(req.body)
      .then(createdFilter => res.status(201).json(createdFilter))
      .catch(err => send500Error('Failed to create filter', err, res));
  }

  /**
   * List custom filters
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let getFilter;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search,
        excludedIds: req.query.excludedIds
      };

      errorMessage = 'Error while searching filter';
      getFilter = lib.customFilter.search(options);
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        user: req.user._id
      };

      errorMessage = 'Failed to list filter';
      getFilter = lib.customFilter.list(options)
        .then(filters => ({
          total_count: filters.length,
          list: filters
        }));
    }

    return getFilter
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  /**
   * Get a custom filter by id
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.customFilter.getById(req.params.id)
      .then(filter => {
        filter = filter.toObject();

        return res.status(200).json(filter);

      })
      .catch(err => send500Error('Failed to get filter', err, res));
  }

  /**
   * Update a custom filter
   *
   * @param {Request} req
   * @param {Response} res
   */
  async function update(req, res) {
    const filter = await lib.customFilter.getById(req.params.id);

    if (!filter) {
      return send404Error('filter not found', res);
    }
    if (!validateFilterOwner(filter, req.user._id)) {
      return send403Error('Your are not permitted to update this filter', res);
    }

    return lib.customFilter.updateById(req.params.id, req.body)
      .then(numberOfUpdatedDocs => {
        if (numberOfUpdatedDocs) {
          return res.status(204).end();
        }

        return send404Error('filter not found', res);
      })
      .catch(err => send500Error('Failed to update filter', err, res));
  }

  /**
   * Delete a custom filter
   *
   * @param {Request} req
   * @param {Response} res
   */
  async function remove(req, res) {
    const filter = await lib.customFilter.getById(req.params.id);

    if (!filter) {
      return send404Error('custom filter not found', res);
    }
    if (!validateFilterOwner(filter, req.user._id)) {
      return send403Error('Your are not permitted to delete this custom filter', res);
    }

    return lib.customFilter.removeById(req.params.id)
      .then(deletedFilter => {
        if (deletedFilter) {
          return res.status(204).end();
        }

        return send404Error('custom filter not found', res);
      })
      .catch(err => send500Error('Failed to delete custom filter', err, res));
  }

  function validateFilterOwner(filter, userId) {
    return filter.user.toString() === userId.toString();
  }
};
