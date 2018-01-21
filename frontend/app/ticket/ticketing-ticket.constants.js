(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .constant('TICKETING_TICKET_EVENTS', {
      CREATED: 'ticketing:ticket:created',
      UPDATED: 'ticketing:ticket:updated'
    })
    .constant('TICKETING_TICKET_WS', {
      namespace: '/ticketing/tickets',
      events: {
        UPDATED: 'ticketing:ticket:updated'
      }
    })
    .constant('TICKETING_TICKET_STATES', {
      NEW: { value: 'New', icon: 'mdi-alert-octagram' },
      IN_PROGRESS: { value: 'In progress', icon: 'mdi-wrench' },
      AWAITING: { value: 'Awaiting', icon: 'mdi-alert-outline' },
      AWAITING_INFORMATION: { value: 'Awaiting information', icon: 'mdi-information-outline' },
      AWAITING_VALIDATION: { value: 'Awaiting validation', icon: 'mdi-check-circle-outline' },
      CLOSED: { value: 'Closed', icon: 'mdi-check-circle' },
      ABANDONED: { value: 'Abandoned', icon: 'mdi-close-circle-outline' }
    });
})(angular);
