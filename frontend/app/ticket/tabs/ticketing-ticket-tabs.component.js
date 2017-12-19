(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketTabs', {
      templateUrl: '/ticketing/app/ticket/tabs/ticketing-ticket-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
