(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingDemandForm', {
      templateUrl: '/ticketing/app/demand/form/ticketing-demand-form.html',
      controller: 'TicketingDemandFormController',
      bindings: {
        demand: '='
      }
    });
})(angular);
