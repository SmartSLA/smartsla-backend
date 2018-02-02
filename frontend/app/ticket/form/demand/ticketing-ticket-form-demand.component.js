(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingTicketFormDemand', {
      controller: 'TicketingTicketFormDemandController',
      bindings: {
        ticket: '=',
        template: '@'
      },
      templateUrl: function($element, $attrs) {
        return $attrs.template;
      }
    });
})(angular);
