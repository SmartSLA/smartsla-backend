'use strict';

module.exports = function(dependencies, lib) {
  const { send404Error, send500Error } = require('../utils')(dependencies);
  const coreUser = dependencies('coreUser');

  return {
    addDemand,
    addSoftware,
    create,
    get,
    list,
    update,
    updatePermissions
  };

  /**
   * Create a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.contract.create(req.body)
      .then(createdContract => res.status(201).json(createdContract))
      .catch(err => send500Error('Failed to create contract', err, res));
  }

  /**
   * Get a contract by ID.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function get(req, res) {
    const populations = [
      {
        path: 'manager'
      },
      {
        path: 'defaultSupportManager'
      },
      {
        path: 'organization'
      },
      {
        path: 'software.template'
      }
    ];

    return lib.contract.getById(req.params.id, { populations })
      .then(contract => {
        contract = contract.toObject();
        if (contract.manager) {
          contract.manager = coreUser.denormalize.denormalize(contract.manager);
        }

        // get all entities of contract's organization
        // then build permissions list
        return lib.organization.list({ parent: contract.organization._id })
          .then(entities => {
            contract.permissions = _buildContractPermissions(contract, entities);

            return res.status(200).json(contract);
          });

      })
      .catch(err => send500Error('Failed to get contract', err, res));
  }

  /**
   * Build permissions list of contract.
   *
   * @param {Object} contract - Contract object
   * @param {Array}  entities - Entities of contract's organization
   * @return {Array}          - List of permission objects
   */
  function _buildContractPermissions(contract, entities) {
    if (contract.permissions === 1) {
      return entities.map(entity => {
        entity = entity.toObject();
        entity.selected = true;

        return entity;
      });
    }

    return entities.map(entity => {
      entity = entity.toObject();
      entity.selected = contract.permissions.indexOf(String(entity._id)) > -1;

      return entity;
    });
  }

  /**
   * List the contracts
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    let getContracts;
    let errorMessage;

    if (req.query.search) {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        search: req.query.search
      };

      errorMessage = 'Error while searching contracts';
      getContracts = lib.contract.search(options);
    } else {
      const options = {
        limit: +req.query.limit,
        offset: +req.query.offset,
        organization: req.query.organization
      };

      options.populations = [{ path: 'manager' }];

      if (!req.query.organization) {
        options.populations.push({ path: 'organization' });
      }

      errorMessage = 'Failed to list contracts';
      getContracts = lib.contract.list(options)
        .then(contracts => {
          const denormalizeManager = manager => coreUser.denormalize.denormalize(manager);

          contracts = contracts.map(contract => {
            if (contract.manager) {
              contract.manager = denormalizeManager(contract.manager);
            }

            return contract;
          });

          return {
            total_count: contracts.length,
            list: contracts
          };
        });
    }

    return getContracts
      .then(result => {
        res.header('X-ESN-Items-Count', result.total_count);
        res.status(200).json(result.list);
      })
      .catch(err => send500Error(errorMessage, err, res));
  }

  /**
   * Update a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function update(req, res) {
    return lib.contract.updateById(req.params.id, req.body)
      .then(modified => {
        if (modified) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to update contract', err, res));
  }

  /**
   * Update permissions for contract.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function updatePermissions(req, res) {
    const { permissions } = req.body;

    return lib.contract.updateById(req.params.id, { permissions })
      .then(modified => {
        if (modified) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to update permissions of contract', err, res));
  }

  /**
   * Add a new software for a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function addSoftware(req, res) {
    return lib.contract.addSoftware(req.params.id, req.body)
      .then(modified => {
        if (modified) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to add software', err, res));
  }

  /**
   * Add a new demand for a contract
   *
   * @param {Request} req
   * @param {Response} res
   */
  function addDemand(req, res) {
    return lib.contract.addDemands(req.params.id, [req.body])
      .then(modified => {
        if (modified) {
          return res.status(204).end();
        }

        return send404Error('Contract not found', res);
      })
      .catch(err => send500Error('Failed to add demand', err, res));
  }
};
