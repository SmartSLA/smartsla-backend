(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .filter('ticketingDemandTime', ticketingDemandTime);

  function ticketingDemandTime() {
    var RATIO = 24;

    return function(input) {
      input = input || 0;

      if (input % RATIO) {
        return input + ' hour(s)';
      }

      return (input / RATIO) + ' day(s)';
    };
  }
})(angular);
