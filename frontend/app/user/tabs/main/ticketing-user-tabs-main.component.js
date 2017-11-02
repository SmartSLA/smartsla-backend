(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingUserTabsMain', {
      templateUrl: '/ticketing/app/user/tabs/main/ticketing-user-tabs-main.html',
      bindings: {
        user: '=',
        isEditMode: '<'
      }
    });
})(angular);
