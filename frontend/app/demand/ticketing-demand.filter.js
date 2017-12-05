(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .filter('ticketingDemandTime', ticketingDemandTime);

  function ticketingDemandTime(TICKETING_TIME_AVAILABLE_UNITS) {
    var DEFAULT_UNIT = TICKETING_TIME_AVAILABLE_UNITS[0];

    return function(input) {
      if (!input) {
        return '0 ' + DEFAULT_UNIT.text;
      }

      for (var i = TICKETING_TIME_AVAILABLE_UNITS.length - 1; i >= 0; i--) {
        if (input % TICKETING_TIME_AVAILABLE_UNITS[i].ratio === 0) {
          return input / TICKETING_TIME_AVAILABLE_UNITS[i].ratio + ' ' + TICKETING_TIME_AVAILABLE_UNITS[i].text;
        }
      }
    };
  }
})(angular);
