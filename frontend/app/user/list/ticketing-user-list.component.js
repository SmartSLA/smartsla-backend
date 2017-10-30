(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingUserList', {
      templateUrl: '/ticketing/app/user/list/ticketing-user-list.html',
      controller: 'TicketingUserListController'
    });
})(angular);
