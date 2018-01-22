(function(angular) {
  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketActivitiesItem', {
      templateUrl: '/ticketing/app/ticket/activities/item/ticketing-ticket-activities-item.html',
      bindings: {
        activity: '<'
      }
    });
})(angular);
