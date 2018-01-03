(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketForm', {
      templateUrl: '/ticketing/app/ticket/form/ticketing-ticket-form.html',
      controller: 'TicketingTicketFormController',
      bindings: {
        ticket: '='
      }
    });
})(angular);
