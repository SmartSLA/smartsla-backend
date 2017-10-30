(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationDetailController', TicketingOrganizationDetailController);

  function TicketingOrganizationDetailController(
    $stateParams,
    ticketingOrganizationClient
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      ticketingOrganizationClient.get($stateParams.organizationId)
        .then(function(response) {
          self.selectedTab = 'main';
          self.organization = response.data;
        });
    }
  }
})(angular);
