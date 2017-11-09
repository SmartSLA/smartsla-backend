(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingOrderService', TicketingOrderService);

  function TicketingOrderService(
    $rootScope,
    $q,
    asyncAction,
    ticketingContractClient,
    TICKETING_ORDER_EVENTS
  ) {
    return {
      create: create
    };

    function create(order) {
      if (!order) {
        return $q.reject(new Error('order is required'));
      }

      var manager = angular.copy(order.manager);

      order.manager = order.manager && order.manager._id ? order.manager._id : order.manager;
      order.defaultSupportManager = order.defaultSupportManager && order.defaultSupportManager._id ? order.defaultSupportManager._id : order.defaultSupportManager;
      order.defaultSupportTechnician = order.defaultSupportTechnician && order.defaultSupportTechnician._id ? order.defaultSupportTechnician._id : order.defaultSupportTechnician;
      order.contract = order.contract && order.contract._id ? order.contract._id : order.contract;
      // TODO: remove if got it from creation form
      order.startDate = new Date();
      order.terminationDate = new Date();

      var notificationMessages = {
        progressing: 'Creating order...',
        success: 'Order created',
        failure: 'Failed to create order'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.createOrder(order.contract, order);
      }).then(function(response) {
        var createdOrder = response.data;

        createdOrder.manager = manager;

        $rootScope.$broadcast(TICKETING_ORDER_EVENTS.ORDER_CREATED, createdOrder);
      });
    }
  }
})(angular);
