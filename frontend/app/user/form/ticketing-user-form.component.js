(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingUserForm', {
      templateUrl: '/ticketing/app/user/form/ticketing-user-form.html',
      bindings: {
        user: '='
      }
    });
})(angular);
