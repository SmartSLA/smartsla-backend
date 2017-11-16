(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingService', TicketingService);

  function TicketingService() {
    return {
      depopulate: depopulate,
      handleAutoCompleteWithOneTag: handleAutoCompleteWithOneTag
    };

    function depopulate(object, keys) {
      angular.forEach(keys, function(key) {
        object[key] = object[key] && object[key]._id ? object[key]._id : object[key];
      });
    }

    function handleAutoCompleteWithOneTag(scope, object, keysMap) {
      angular.forEach(keysMap, function(value, key) {
        scope[key] = object && object[value] ? [object[value]] : [];

        scope.$watch(key, function() {
          object[value] = scope[key].length ? scope[key][0] : null;
        }, true);
      });
    }
  }
})(angular);
