(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketDetailSubheader', {
      templateUrl: '/ticketing/app/ticket/detail/subheader/ticketing-ticket-detail-subheader.html',
      bindings: {
        isEditMode: '<',
        onEditBtnClick: '&',
        onCancelBtnClick: '&',
        onSaveBtnClick: '&',
        form: '<'
      }
    });
})(angular);
