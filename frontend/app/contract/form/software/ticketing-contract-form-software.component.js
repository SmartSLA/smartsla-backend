(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractFormSoftware', {
      templateUrl: '/ticketing/app/contract/form/software/ticketing-contract-form-software.html',
      controller: 'TicketingContractFormSoftwareController',
      bindings: {
        contract: '<'
      }
    });
})(angular);
