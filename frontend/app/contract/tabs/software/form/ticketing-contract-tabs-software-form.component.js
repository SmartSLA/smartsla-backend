(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingContractTabsSoftwareForm', {
      templateUrl: '/ticketing/app/contract/tabs/software/form/ticketing-contract-tabs-software-form.html',
      controller: 'TicketingContractTabsSoftwareFormController',
      bindings: {
        software: '=',
        editMode: '<',
        existingSoftwareIds: '<',
        availableSoftwareTypes: '<'
      }
    });
})(angular);
