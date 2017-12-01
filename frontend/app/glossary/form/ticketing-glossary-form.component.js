(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingGlossaryForm', {
      templateUrl: '/ticketing/app/glossary/form/ticketing-glossary-form.html',
      controller: 'TicketingGlossaryFormController',
      bindings: {
        category: '<'
      }
    });
})(angular);
