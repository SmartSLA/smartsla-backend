(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingGlossaryListGroup', {
      templateUrl: '/ticketing/app/glossary/list/group/ticketing-glossary-list-group.html',
      bindings: {
        glossary: '<',
        isCollapsed: '<'
      }
    });
})(angular);
