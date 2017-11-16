(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(
    dynamicDirectiveService,
    TicketingSearchService,
    TicketingOrganizationService
  ) {
    var group = new dynamicDirectiveService.DynamicDirective(true, 'ticketing-application-menu', { priority: -10 });
    var organiztionSearchProvider = TicketingOrganizationService.getOrganizationSearchProvider();
    var entitySearchProvider = TicketingOrganizationService.getEntitySearchProvider();

    TicketingSearchService.addProvider(organiztionSearchProvider);
    TicketingSearchService.addProvider(entitySearchProvider);
    dynamicDirectiveService.addInjection('esn-application-menu', group);
  });
})(angular);
