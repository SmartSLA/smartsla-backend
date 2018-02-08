(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingHeader', {
      templateUrl: '/ticketing/app/header/ticketing-header.html',
      controller: 'TicketingHeaderController'
    });
})(angular);
