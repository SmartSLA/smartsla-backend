(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .constant('TICKETING_CONTRACT_EVENTS', {
      CONTRACT_CREATED: 'ticketing:contract:created',
      SOFTWARE_ADDED: 'ticketing:contract:software:added',
      SOFTWARE_UPDATED: 'ticketing:contract:software:updated',
      DEMAND_ADDED: 'ticketing:contract:demand:added'
    });
})(angular);
