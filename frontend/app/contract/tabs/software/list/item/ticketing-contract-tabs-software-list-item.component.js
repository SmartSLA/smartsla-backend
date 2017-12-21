(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsSoftwareListItem', {
      templateUrl: '/ticketing/app/contract/tabs/software/list/item/ticketing-contract-tabs-software-list-item.html',
      bindings: {
        software: '<',
        onEditBtnClick: '&'
      }
    });
})(angular);
