(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingGlossaryGroup', {
      templateUrl: '/ticketing/app/glossary/group/ticketing-glossary-group.html',
      bindings: {
        group: '<'
      }
    });
})(angular);
