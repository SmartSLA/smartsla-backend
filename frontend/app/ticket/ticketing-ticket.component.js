(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicket', {
      templateUrl: '/ticketing/app/ticket/ticketing-ticket.html',
      controller: 'TicketingTicketController',
      bindings: {
        scope: '@'
      }
    });
})(angular);
