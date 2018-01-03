(function(angular) {
  angular.module('linagora.esn.ticketing')
    .component('ticketingAttachments', {
      templateUrl: '/ticketing/app/common/attachments/ticketing-attachments.html',
      controller: 'TicketingAttachmentsController',
      bindings: {
        attachments: '='
      }
    });
})(angular);
