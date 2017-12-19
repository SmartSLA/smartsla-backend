(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketListItem', {
      templateUrl: '/ticketing/app/ticket/list/item/ticketing-ticket-list-item.html',
      bindings: {
        ticket: '<'
      }
    });
})(angular);
