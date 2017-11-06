(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .constant('TICKETING_USER_EVENTS', {
      USER_CREATED: 'user:created',
      USER_UPDATED: 'user:updated'
    });
})(angular);
