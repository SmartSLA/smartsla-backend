(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingDemand', {
      templateUrl: '/ticketing/app/demand/ticketing-demand.html',
      controller: 'TicketingDemandController'
    });
})(angular);
