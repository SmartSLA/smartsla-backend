'use strict';

/* global _: false */

angular.module('esn.router', ['ui.router'])
  .factory('session', function($q) {
    return {
      ready: $q.when(),
      user: {},
      domain: {},
      userIsDomainAdministrator: function() {
        return false;
      }
    };
  });
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
  .constant('_', _)
  .filter('bytes', function() {
    return function(input) { return input; };
  });
angular.module('ui.select', {});
angular.module('ngSanitize', {});
angular.module('ngTagsInput', [])
  .provider('tagsInputConfig', function() {
    this.setDefaults = function() {};
    this.$get = function() {};
    this.setActiveInterpolation = function() {};
  });
angular.module('esn.i18n', [])
  .filter('esnI18n', function() {
    return function(input) { return input; };
  })
  .factory('esnI18nService', function() {
    return {
      translate: function(input) {
        return {
          toString: function() {
            return input;
          }
        };
      }
    };
  });
angular.module('esn.notification', [])
  .factory('notificationFactory', function() {
    return {
      weakError: function() {}
    };
  });
angular.module('esn.session', []);
angular.module('esn.domain', [])
  .factory('domainAPI', function() {
    return {};
  });
angular.module('esn.template', [])
  .provider('esnTemplate', function() {
    this.setSuccessTemplate = function() {};
    this.$get = function() {};
  });
angular.module('esn.module-registry', [])
  .factory('esnModuleRegistry', function() {
    return {
      add: function() {}
    };
  });
angular.module('esn.file', [])
  .factory('fileUploadService', function() {
    return {
      get: function() {}
    };
  });
