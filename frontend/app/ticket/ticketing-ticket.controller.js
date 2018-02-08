(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketController', TicketingTicketController);

  function TicketingTicketController($stateParams) {
    var DEFAULT_TAB = $stateParams.state || 'open';
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.selectedTab = DEFAULT_TAB;
    }
  }
})(angular);
