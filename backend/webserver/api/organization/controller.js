'use strict';

module.exports = function(dependencies, lib) {
  const { send500Error } = require('../utils')(dependencies);

  return {
    create,
    list,
    update
  };

  /**
   * Create an organization
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.organization.create(req.body)
      .then(createdOrganization => res.status(201).json(createdOrganization))
      .catch(err => send500Error('Failed to create organization', err, res));
  }

  /**
   * List the organizations
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const options = {
      limit: +req.query.limit,
      offset: +req.query.offset
    };

    return lib.organization.list(options)
      .then(organizations => {
        res.header('X-ESN-Items-Count', organizations.length);
        res.status(200).json(organizations);
      })
      .catch(err => send500Error('Failed to list organization', err, res));
  }

  /**
   * Update an organization
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.organization.updateById(req.params.id, req.body)
      .then(() => res.status(204).end())
      .catch(err => send500Error('Failed to update organization', err, res));
  }
};
