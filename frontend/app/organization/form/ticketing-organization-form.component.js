(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingOrganizationForm', {
      templateUrl: '/ticketing/app/organization/form/ticketing-organization-form.html',
      controller: 'TicketingOrganizationFormController',
      bindings: {
        organization: '='
      }
    });
})(angular);
