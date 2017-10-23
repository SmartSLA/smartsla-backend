'use strict';

const q = require('q');
const { DEFAULT_LIST_OPTIONS } = require('./constants');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Order = mongoose.model('Order');
  const contract = require('./contract')(dependencies);

  return {
    create,
    getById,
    list,
    updateById
  };

  /**
   * Create an order
   * @param {Object} order - The order object
   * @param {Promise}      - Resolve on success
   */
  function create(order) {
    order = order instanceof Order ? order : new Order(order);

    return Order.create(order)
      .then(createdOrder => contract.addOrder(createdOrder.contract, createdOrder._id)
        .then(() => createdOrder)
        .catch(err => removeById(createdOrder._id) // remove order if failed to update list of orders in contract
          .then(() => q.reject(err))));
  }

  /**
   * List orders
   * @param {Object}   options  - The options object, may contain offset and limit
   * @param {Promise}           - Resolve on success
   */
  function list(options) {
    options = options || {};

    return Order
      .find()
      .skip(+options.offset || DEFAULT_LIST_OPTIONS.OFFSET)
      .limit(+options.limit || DEFAULT_LIST_OPTIONS.LIMIT)
      .sort('-creation')
      .exec();
  }

  /**
   * Update an order by ID
   * @param {String}   orderId   - The order ID
   * @param {Object}   modified  - The modified order object
   * @param {Promise}            - Resolve on success
   */
  function updateById(orderId, modified) {
    return Order.update({ _id: orderId }, { $set: modified }).exec();
  }

  /**
   * Get an order by ID
   * @param {String}   orderId - The order ID
   * @param {Promise}          - Resolve on success
   */
  function getById(orderId) {
    return Order.findById(orderId).exec();
  }

  /**
   * Remove an order by ID
   * @param {String}   orderId - The order ID
   * @param {Promise}          - Resolve on success
   */
  function removeById(orderId) {
    return Order.findByIdAndRemove(orderId).exec();
  }
};
