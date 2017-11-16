'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');

  return {
    create,
    get,
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
   * Get an organization by Id
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    return lib.organization.getById(req.params.id)
      .then(organization => {
        organization = organization.toObject();
        if (organization.manager) {
          organization.manager = coreUser.denormalize.denormalize(organization.manager);
        }

        const denormalizeUsers = users => users.map(user => coreUser.denormalize.denormalize(user));

        organization.users = denormalizeUsers(organization.users);

        return res.status(201).json(organization);
      })
      .catch(err => send500Error('Failed to get organization', err, res));
  }

  /**
   * List the organizations
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let getOrganizations;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search,
        parent: req.query.parent
      };

      errorMessage = 'Error while searching organizations';
      getOrganizations = lib.organization.search(options);
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        parent: req.query.parent
      };

      errorMessage = 'Failed to list organization';
      getOrganizations = lib.organization.list(options)
        .then(organizations => {
          const denormalizer = organization => {
            organization.manager = coreUser.denormalize.denormalize(organization.manager, true);

            return organization;
          };

          return {
            total_count: organizations.length,
            list: organizations.map(organization => denormalizer(organization))
          };
        });
    }

    return getOrganizations
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
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
