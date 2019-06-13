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
    return lib.contract.getById(req.params.id)
      .then(contract => {
        contract = contract.toObject();

        return res.status(200).json(contract);

      })
      .catch(err => send500Error('Failed to get contract', err, res));
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

};
