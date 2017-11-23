(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingSelectionSelectAll', {
      templateUrl: '/ticketing/app/common/selection/ticketing-selection-select-all.html',
      controller: 'TicketingSelectionSelectAllController',
      bindings: {
        items: '<',
        form: '<'
      }
    });
})(angular);
