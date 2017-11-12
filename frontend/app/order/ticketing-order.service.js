(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingOrderService', TicketingOrderService);

  function TicketingOrderService(
    $rootScope,
    $q,
    asyncAction,
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
      orderToUpdate.manager = orderToUpdate.manager && orderToUpdate.manager._id ? orderToUpdate.manager._id : orderToUpdate.manager;
      orderToUpdate.defaultSupportManager = orderToUpdate.defaultSupportManager && orderToUpdate.defaultSupportManager._id ? orderToUpdate.defaultSupportManager._id : orderToUpdate.defaultSupportManager;
      orderToUpdate.defaultSupportTechnician = orderToUpdate.defaultSupportTechnician && orderToUpdate.defaultSupportTechnician._id ? orderToUpdate.defaultSupportTechnician._id : orderToUpdate.defaultSupportTechnician;

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
