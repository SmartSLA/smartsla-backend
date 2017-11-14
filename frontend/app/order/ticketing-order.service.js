/*eslint-disable no-warning-comments*/

(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingOrderService', TicketingOrderService);

  function TicketingOrderService(
    $rootScope,
    $q,
    asyncAction,
    TicketingService,
    ticketingContractClient,
    ticketingOrderClient,
    TICKETING_ORDER_EVENTS
  ) {
    return {
      create: create,
      get: get,
      update: update
    };

    function create(order) {
      if (!order) {
        return $q.reject(new Error('order is required'));
      }

      var manager = angular.copy(order.manager);

      TicketingService.depopulate(order, ['manager', 'defaultSupportManager', 'defaultSupportTechnician', 'contract']);

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

    function get(orderId) {
      return ticketingOrderClient.get(orderId)
        .then(function(response) {
          return response.data;
        });
    }

    function update(order) {
      if (!order) {
        return $q.reject(new Error('order is required'));
      }

      var orderToUpdate = angular.copy(order);
      var contractId = orderToUpdate.contract._id;

      delete orderToUpdate.contract;
      TicketingService.depopulate(order, ['manager', 'defaultSupportManager', 'defaultSupportTechnician']);

      var notificationMessages = {
        progressing: 'Updating order...',
        success: 'Order updated',
        failure: 'Failed to update order'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingContractClient.updateOrder(contractId, orderToUpdate._id, orderToUpdate);
      });
    }
  }
})(angular);
