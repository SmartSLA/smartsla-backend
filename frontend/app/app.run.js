(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(
    dynamicDirectiveService,
    TicketingSearchService,
    TicketingOrganizationService,
    TicketingSoftwareService
  ) {
    var group = new dynamicDirectiveService.DynamicDirective(true, 'ticketing-application-menu', { priority: -10 });
    var organiztionSearchProvider = TicketingOrganizationService.getOrganizationSearchProvider();
    var entitySearchProvider = TicketingOrganizationService.getEntitySearchProvider();
    var softwareSearchProvider = TicketingSoftwareService.getSearchProvider();

    TicketingSearchService.addProvider(organiztionSearchProvider);
    TicketingSearchService.addProvider(entitySearchProvider);
    TicketingSearchService.addProvider(softwareSearchProvider);
    dynamicDirectiveService.addInjection('esn-application-menu', group);
  });
})(angular);
