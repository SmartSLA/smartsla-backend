(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingUserAutoComplete', {
      templateUrl: '/ticketing/app/user/auto-complete/ticketing-user-auto-complete.html',
      controller: 'TicketingUserAutoCompleteController',
      bindings: {
        newUsers: '=',
        maxTags: '<'
      }
    });
})(angular);
