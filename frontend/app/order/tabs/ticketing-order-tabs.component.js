(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrderTabs', {
      templateUrl: '/ticketing/app/order/tabs/ticketing-order-tabs.html',
      bindings: {
        selectedTab: '='
      }
    });
})(angular);
