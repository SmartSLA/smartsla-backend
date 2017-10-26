'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');

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

        const denormalizer = organization => {
          organization.administrator = coreUser.denormalize.denormalize(organization.administrator, true);

          return organization;
        };

        res.status(200).json(organizations.map(organization => denormalizer(organization)));
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
      .then(updatedResult => {
        // updatedResult: { "ok" : 1, "nModified" : 1, "n" : 1 }
        // updatedResult.n: The number of documents selected for update
        // http://mongoosejs.com/docs/api.html#model_Model.update
        if (updatedResult.n) {
          return res.status(204).end();
        }

        return send404Error('Organization not found', res);
      })
      .catch(err => send500Error('Failed to update organization', err, res));
  }
};
