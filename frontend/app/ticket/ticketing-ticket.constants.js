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
    });
})(angular);
