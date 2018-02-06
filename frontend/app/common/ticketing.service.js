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
        if (object && Array.isArray(object[key])) {
          object[key] = object[key].map(function(item) {
            return item._id ? item._id : item;
          });
        } else if (object && object[key]) {
          object[key] = object[key]._id ? object[key]._id : object[key];
        }
      });
    }
  }
})(angular);
