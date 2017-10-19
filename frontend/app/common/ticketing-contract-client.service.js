(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingContractClient', ticketingContractClient);

  function ticketingContractClient(ticketingRestangular) {
    return {
      create: create,
      list: list,
      update: update
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
     * Update a contract
     * @param  {String} contractId  - The contract ID
     * @param  {Object} updateData  - The update object
     * @return {Promise}            - Resolve response with updated contract
     */
    function update(contractId, updateData) {
      return ticketingRestangular.one('contracts', contractId).customPUT(updateData);
    }
  }
})(angular);
