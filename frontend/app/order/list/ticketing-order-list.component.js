(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrderList', {
      templateUrl: '/ticketing/app/order/list/ticketing-order-list.html',
      controller: 'TicketingOrderListController',
      bindings: {
        contract: '<'
      }
    });
})(angular);
