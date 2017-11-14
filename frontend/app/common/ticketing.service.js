(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingService', TicketingService);

  function TicketingService() {
    return {
      depopulate: depopulate
    };

    function depopulate(object, keys) {
      angular.forEach(keys, function(key) {
        object[key] = object[key] && object[key]._id ? object[key]._id : object[key];
      });
    }
  }
})(angular);
