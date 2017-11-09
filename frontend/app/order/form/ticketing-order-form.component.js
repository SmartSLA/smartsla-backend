(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrderForm', {
      templateUrl: '/ticketing/app/order/form/ticketing-order-form.html',
      controller: 'TicketingOrderFormController',
      bindings: {
        order: '='
      }
    });
})(angular);
