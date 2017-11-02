(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingUserTabs', {
      templateUrl: '/ticketing/app/user/tabs/ticketing-user-tabs.html',
      bindings: {
        selectedTab: '=',
        isEntityMode: '<'
      }
    });
})(angular);
