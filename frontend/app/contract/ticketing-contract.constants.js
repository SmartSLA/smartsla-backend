(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .constant('TICKETING_CONTRACT_EVENTS', {
      CONTRACT_CREATED: 'ticketing:contract:created',
      SOFTWARE_ADDED: 'ticketing:contract:software:added'
    });
})(angular);
