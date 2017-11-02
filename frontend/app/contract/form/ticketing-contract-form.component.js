(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractForm', {
      templateUrl: '/ticketing/app/contract/form/ticketing-contract-form.html',
      controller: 'TicketingContractFormController',
      bindings: {
        contract: '='
      }
    });
})(angular);
