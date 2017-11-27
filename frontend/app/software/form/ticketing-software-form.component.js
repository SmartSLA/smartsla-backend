(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingSoftwareForm', {
      templateUrl: '/ticketing/app/software/form/ticketing-software-form.html',
      controller: 'TicketingSoftwareFormController',
      bindings: {
        software: '='
      }
    });
})(angular);
