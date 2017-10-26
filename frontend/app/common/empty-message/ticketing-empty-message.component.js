(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingEmptyMessage', {
    templateUrl: '/ticketing/app/common/empty-message/ticketing-empty-message.html',
    bindings: {
      message: '@',
      type: '@',
      icon: '@?'
    },
    controller: 'ticketingEmptyMessageController'
  });
})(angular);
