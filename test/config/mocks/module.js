'use strict';

/* global _: false */

angular.module('esn.router', ['ui.router']);
angular.module('esn.http', [])
  .factory('httpErrorHandler', function() {
    return {
      redirectToLogin: angular.noop
    };
  });
angular.module('esn.async-action', [])
  .factory('asyncAction', function() {
    return function(message, action) {
      return action();
    };
  })
  .factory('rejectWithErrorNotification', function() {
    return function() {
      return $q.reject();
    };
  });
angular.module('esn.scroll', [])
  .factory('elementScrollService', function() {
    return {};
  });
angular.module('esn.attendee', [])
  .constant('ESN_ATTENDEE_DEFAULT_TEMPLATE_URL', '')
  .factory('attendeeService', function() {
    return {
      getAttendeeCandidates: function() {}
    };
  });
angular.module('esn.core', [])
  .constant('_', _);
