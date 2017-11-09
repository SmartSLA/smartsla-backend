(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(
    dynamicDirectiveService,
    TicketingSearchService,
    TicketingOrganizationService
  ) {
    var group = new dynamicDirectiveService.DynamicDirective(true, 'ticketing-application-menu', { priority: -10 });
    var organiztionSearchProvider = TicketingOrganizationService.getSearchProvider();

    TicketingSearchService.addProvider(organiztionSearchProvider);
    dynamicDirectiveService.addInjection('esn-application-menu', group);
  });
})(angular);
