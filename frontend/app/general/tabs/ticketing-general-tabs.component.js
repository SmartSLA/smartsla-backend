(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingGeneralTabs', {
      templateUrl: '/ticketing/app/general/tabs/ticketing-general-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
