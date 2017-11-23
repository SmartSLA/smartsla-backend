(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingGlobalTabs', {
      templateUrl: '/ticketing/app/global/tabs/ticketing-global-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
