(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingDemandTime', {
      templateUrl: '/ticketing/app/demand/time/ticketing-demand-time.html',
      controller: 'TicketingDemandTimeController',
      bindings: {
        time: '=',
        label: '@'
      }
    });
})(angular);
