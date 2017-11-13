(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrderTabsMain', {
      templateUrl: '/ticketing/app/order/tabs/main/ticketing-order-tabs-main.html',
      bindings: {
        order: '=',
        isEditMode: '<'
      }
    });
})(angular);
