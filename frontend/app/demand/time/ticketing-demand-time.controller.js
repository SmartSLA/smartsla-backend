(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingDemandTimeController', TicketingDemandTimeController);

  function TicketingDemandTimeController(
    $scope,
    _,
    TICKETING_TIME_UNITS,
    TICKETING_CONTRACT_EVENTS
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.availableUnits = TICKETING_TIME_UNITS;
      self.unit = TICKETING_TIME_UNITS[0];
      self.onChange = onChange;

      $scope.$on(TICKETING_CONTRACT_EVENTS.DEMAND_ADDED, function() {
        _onDemandAdded();
      });
    }

    function onChange() {
      self.time = self.value ? self.value * self.unit.ratio : 0;
    }

    function _onDemandAdded() {
      self.value = null;
      self.unit = TICKETING_TIME_UNITS[0];
    }
  }
})(angular);
