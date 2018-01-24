(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketTimerBar', {
      templateUrl: '/ticketing/app/ticket/timer-bar/ticketing-ticket-timer-bar.html',
      controller: 'TicketingTicketTimerBarController',
      bindings: {
        countdown: '<',
        interval: '<',
        passed: '<',
        stop: '<'
      }
    });
})(angular);
