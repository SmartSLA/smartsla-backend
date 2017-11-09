(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticketingSearchAutoComplete', {
      templateUrl: '/ticketing/app/common/search/auto-complete/ticketing-search-auto-complete.html',
      controller: 'TicketingSearchAutoCompleteController',
      bindings: {
        addFromAutocompleteOnly: '<',
        placeholder: '@',
        maxTags: '<',
        newTags: '='
      }
    });
})(angular);
