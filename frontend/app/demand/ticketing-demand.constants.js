(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    /**
     * Ticketing time available units
     * Each unit has:
     * - text: unit's text to display
     * - ratio: unit's ratio is caculated base on hour. Example: 1 day = 24 hours, so ratio of day unit is 24
     * The units must be order by increasement of ratio
     */
    .constant('TICKETING_TIME_AVAILABLE_UNITS', [
      {
        text: 'hour(s)',
        ratio: 1
      },
      {
        text: 'day(s)',
        ratio: 24
      }
    ]);
})(angular);
