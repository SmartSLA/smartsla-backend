(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .filter('ticketingTime', ticketingTime);

  function ticketingTime($filter, TICKETING_TIME_UNITS) {
    var DEFAULT_UNIT = TICKETING_TIME_UNITS[0];

    return function(input) {
      if (!input) {
        return '0 ' + DEFAULT_UNIT.name;
      }

      var results = [];
      var tmp = input;

      for (var i = TICKETING_TIME_UNITS.length - 1; i >= 0; i--) {
        var value = Math.floor(tmp / TICKETING_TIME_UNITS[i].ratio);

        if (value > 0) {
          results.push(value > 1 ? value + ' ' + TICKETING_TIME_UNITS[i].name + 's' : value + ' ' + TICKETING_TIME_UNITS[i].name);
          tmp -= value * TICKETING_TIME_UNITS[i].ratio;

          if (tmp === 0) {
            return results.join(' ');
          }
        }
      }

      return results.join(' ');
    };
  }
})(angular);
