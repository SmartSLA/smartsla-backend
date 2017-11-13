(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingOrderClient', ticketingOrderClient);

  function ticketingOrderClient(ticketingRestangular) {
    var API_CONTEXT = 'orders';

    return {
      get: get
    };

    /**
     * Get an order by ID.
     * @param  {String} orderId - The order ID
     * @return {Promise}        - Resolve response with found order
     */
    function get(orderId) {
      return ticketingRestangular.one(API_CONTEXT, orderId).get();
    }
  }
})(angular);
