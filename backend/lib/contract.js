'use strict';

const { DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Contract = mongoose.model('Contract');

  return {
    addOrder,
    create,
    getById,
    list,
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

    return Contract
      .find()
      .populate('organization')
      .populate('manager')
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-creation')
      .exec();
  }

  /**
   * Update a contract by ID
   * @param {String}   contractId - The contract ID
   * @param {Object}   modified   - The modified contract object
   * @param {Promise}             - Resolve on success
   */
  function updateById(contractId, modified) {
    return Contract.update({ _id: contractId }, { $set: modified }).exec();
  }

  /**
   * Add a order into a contract
   * @param {String}   contractId - The contract ID
   * @param {Object}   orderId    - The order ID
   * @param {Promise}             - Resolve on success
   */
  function addOrder(contractId, orderId) {
    return Contract.update({ _id: contractId }, { $push: { orders: orderId }}).exec();
  }

  /**
   * Get an contract by ID
   * @param {String}   contractId - The contract ID
   * @param {Promise}             - Resolve on success
   */
  function getById(contractId) {
    return Contract
      .findById(contractId)
      .populate('manager')
      .populate('organization')
      .exec();
  }
};
