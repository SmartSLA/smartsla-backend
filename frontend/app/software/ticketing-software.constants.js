(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .constant('TICKETING_SOFTWARE_EVENTS', {
      CREATED: 'ticketing:software:created',
      UPDATED: 'ticketing:software:updated'
    });
})(angular);
