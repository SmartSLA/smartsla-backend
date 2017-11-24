(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingSettingsTabs', {
      templateUrl: '/ticketing/app/settings/tabs/ticketing-settings-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
