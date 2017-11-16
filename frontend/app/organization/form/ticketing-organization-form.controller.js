(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationFormController', TicketingOrganizationFormController);

  function TicketingOrganizationFormController($scope, TicketingService) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.organization = self.organization || {};
      TicketingService.handleAutoCompleteWithOneTag($scope, self.organization, {
        newManagers: 'manager'
      });
    }
  }
})(angular);
