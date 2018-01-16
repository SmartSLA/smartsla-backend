(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .filter('ticketingJoinArray', ticketingJoinArray);

  function ticketingJoinArray() {
    var DEFAULT_SEPARATOR = ', ';

    return function(input, separator) {
      input = input || [];
      separator = separator || DEFAULT_SEPARATOR;

      return input.join(separator);
    };
  }
})(angular);
