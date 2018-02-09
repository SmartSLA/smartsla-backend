(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketList', {
      templateUrl: '/ticketing/app/ticket/list/ticketing-ticket-list.html',
      controller: 'TicketingTicketListController',
      bindings: {
        scope: '<',
        state: '@'
      }
    });
})(angular);
