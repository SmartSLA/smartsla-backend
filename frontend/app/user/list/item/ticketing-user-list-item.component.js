(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingUserListItem', {
      templateUrl: '/ticketing/app/user/list/item/ticketing-user-list-item.html',
      bindings: {
        user: '<'
      }
    });
})(angular);
