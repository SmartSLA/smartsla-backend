(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingContractDetailSubheader', {
    templateUrl: '/ticketing/app/contract/detail/subheader/ticketing-contract-detail-subheader.html',
    bindings: {
      title: '<'
    }
  });
})(angular);
