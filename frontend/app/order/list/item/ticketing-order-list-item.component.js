(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingOrderListItem', {
    templateUrl: '/ticketing/app/order/list/item/ticketing-order-list-item.html',
    bindings: {
      order: '<'
    }
  });
})(angular);
