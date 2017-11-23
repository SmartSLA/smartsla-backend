(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingContractClient', ticketingContractClient);

  function ticketingContractClient(ticketingRestangular) {
    return {
      addSoftware: addSoftware,
      create: create,
      createOrder: createOrder,
      get: get,
      list: list,
      listOrders: listOrders,
      update: update,
      updatePermissions: updatePermissions,
      updateOrder: updateOrder
    };

    /**
     * List contract
     * @param  {Object} options - Query option, possible attributes are limit and offset
     * @return {Promise}        - Resolve response with list of contracts
     */
    function list(options) {
      return ticketingRestangular.all('contracts').getList(options);
    }

    /**
     * Create a new contract
     * @param  {Object} contract - The contract object
     * @return {Promise}         - Resolve response with created contract
     */
    function create(contract) {
      return ticketingRestangular.all('contracts').post(contract);
    }

    /**
     * Get a contract by Id
     * @param  {String} contractId - The contract Id
     * @return {Promise}           - Resolve response with an contract
     */
    function get(contractId) {
      return ticketingRestangular.one('contracts', contractId).get();
    }

    /**
     * Update a contract
     * @param  {String} contractId  - The contract ID
     * @param  {Object} updateData  - The update object
     * @return {Promise}            - Resolve on success
     */
    function update(contractId, updateData) {
      return ticketingRestangular.one('contracts', contractId).customPOST(updateData);
    }

    /**
     * Update permissions of contract.
     * @param  {String} contractId   - The contract ID
     * @param  {Object} permissions  - The update permissions
     * @return {Promise}             - Resolve on success
     */
    function updatePermissions(contractId, permissions) {
      return ticketingRestangular
        .one('contracts', contractId)
        .one('permissions')
        .customPOST(permissions);
    }

    /**
     * Add a software for a contract.
     * @param  {String} contractId   - The contract ID
     * @param  {Object} software     - The software object
     * @return {Promise}             - Resolve on success
     */
    function addSoftware(contractId, software) {
      return ticketingRestangular
        .one('contracts', contractId)
        .one('software')
        .customPOST(software);
    }

    /**
     * List orders
     * @param  {Object} options - Query option, possible attributes are limit and offset
     * @return {Promise}        - Resolve response with list of orders
     */
    function listOrders(contractId, options) {
      return ticketingRestangular
        .one('contracts', contractId)
        .all('orders').getList(options);
    }

    /**
     * Create a new order
     * @param  {Object} order - The order object
     * @return {Promise}      - Resolve response with created order
     */
    function createOrder(contractId, order) {
      return ticketingRestangular
        .one('contracts', contractId)
        .all('orders').post(order);
      }

    /**
     * Update a order
     * @param  {String} orderId     - The order ID
     * @param  {Object} updateData  - The update object
     * @return {Promise}            - Resolve response with updated order
     */
    function updateOrder(contractId, orderId, updateData) {
      return ticketingRestangular
        .one('contracts', contractId)
        .one('orders', orderId)
        .customPUT(updateData);
    }
  }
})(angular);
