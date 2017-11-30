(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSettingsController', TicketingSettingsController);

  function TicketingSettingsController() {
    var DEFAULT_TAB = 'demand';
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.selectedTab = DEFAULT_TAB;
    }
  }
})(angular);
