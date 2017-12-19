(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingSoftwareListItem', {
      templateUrl: '/ticketing/app/software/list/item/ticketing-software-list-item.html',
      bindings: {
        software: '<',
        onEditBtnClick: '&'
      }
    });
})(angular);
