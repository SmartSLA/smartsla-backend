(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrderFormController', TicketingOrderFormController);

  function TicketingOrderFormController($scope, TicketingService) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.order = self.order || {};
      TicketingService.handleAutoCompleteWithOneTag($scope, self.order, {
        newManagers: 'manager',
        newDefaultSupportManagers: 'defaultSupportManager',
        newDefaultSupportTechnicians: 'defaultSupportTechnician'
      });
    }
  }
})(angular);
