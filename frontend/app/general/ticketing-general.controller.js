(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingGeneralController', TicketingGeneralController);

  function TicketingGeneralController() {
    var DEFAULT_TAB = 'demand';
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.selectedTab = DEFAULT_TAB;
    }
  }
})(angular);
