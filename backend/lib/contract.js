'use strict';

const { DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');

  return {
    addDemands,
    addSoftware,
    create,
    getById,
    list,
    listByCursor,
    updateById
  };

  /**
   * Create an contract
   * @param {Object}  contract - The contract object
   * @param {Promise}          - Resolve on success
   */
  function create(contract) {
    contract = contract instanceof Contract ? contract : new Contract(contract);

    return Contract.create(contract);
  }

  /**
   * List contracts
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options) {
    options = options || {};

    const findOptions = options.organization ? { organization: options.organization } : {};

    return Contract
      .find(findOptions)
      .populate(options.populations)
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-creation')
      .exec();
  }

  /**
   * Update a contract by ID
   * @param {String}   contractId - The contract ID
   * @param {Object}   modified   - The modified contract object
   * @param {Promise}             - Resolve on success with the number of documents selected for update
   */
  function updateById(contractId, modified) {
    return Contract.update({ _id: contractId }, { $set: modified }).exec()
      .then(updatedResult => updatedResult.n); // http://mongoosejs.com/docs/api.html#model_Model.update
  }

  /**
   * Add a software for a contract
   * @param {String}   contractId    - The contract ID
   * @param {Object}   softwareToAdd - The an array or a object of software to add
   * @param {Promise}                - Resolve on success with the number of documents selected for update
   */
  function addSoftware(contractId, softwareToAdd) {
    softwareToAdd = Array.isArray(softwareToAdd) ? softwareToAdd : [softwareToAdd];

    return Contract.update({ _id: contractId }, { $addToSet: { software: { $each: softwareToAdd } } }).exec()
      .then(updatedResult => updatedResult.n); // http://mongoosejs.com/docs/api.html#model_Model.update
  }

  /**
   * Add demands for a contract
   * @param {String}   contractId  - The contract ID
   * @param {Object}   demands     - The array of demands to add
   * @param {Promise}              - Resolve on success with the number of documents selected for update
   */
  function addDemands(contractId, demands) {
    return Contract.update({ _id: contractId }, { $addToSet: { demands: { $each: demands } } }).exec()
      .then(updatedResult => updatedResult.n); // http://mongoosejs.com/docs/api.html#model_Model.update
  }

  /**
   * Get an contract by ID
   * @param {String}   contractId - The contract ID
   * @param {Promise}             - Resolve on success
   */
  function getById(contractId, options = {}) {
    const query = Contract.findById(contractId);

    if (options.populations) {
      query.populate(options.populations);
    }

    return query.exec();
  }

  /**
   * List contracts using cursor
   * @param {Promise} - Resolve on success with a cursor object
   */
  function listByCursor() {
    return Contract.find().cursor();
  }
};
