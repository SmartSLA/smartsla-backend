(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabs', {
      templateUrl: '/ticketing/app/contract/tabs/ticketing-contract-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
