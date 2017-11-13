(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrderDetailSubheader', {
      templateUrl: '/ticketing/app/order/detail/subheader/ticketing-order-detail-subheader.html',
      bindings: {
        title: '<',
        isEditMode: '<',
        onEditBtnClick: '&',
        onCancelBtnClick: '&',
        onSaveBtnClick: '&',
        form: '<',
        selectedTab: '<'
      }
    });
})(angular);
