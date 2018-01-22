(function(angular) {
  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketActivities', {
      templateUrl: '/ticketing/app/ticket/activities/ticketing-ticket-activities.html',
      controller: 'TicketingTicketActivitiesController',
      bindings: {
        ticketId: '<'
      }
    });
})(angular);
