(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(
    TicketingSearchService,
    TicketingOrganizationService,
    TicketingSoftwareService,
    TicketingUserService,
    TicketingContractService,
    esnModuleRegistry,
    TicketingTicketLiveUpdateInitializer,
    TICKETING_MODULE_METADATA
  ) {
    var organiztionSearchProvider = TicketingOrganizationService.getOrganizationSearchProvider();
    var entitySearchProvider = TicketingOrganizationService.getEntitySearchProvider();
    var softwareSearchProvider = TicketingSoftwareService.getSearchProvider();
    var contractSearchProvider = TicketingContractService.getSearchProvider();
    var userSearchProvider = TicketingUserService.getSearchProvider();

    TicketingSearchService.addProvider(organiztionSearchProvider);
    TicketingSearchService.addProvider(entitySearchProvider);
    TicketingSearchService.addProvider(softwareSearchProvider);
    TicketingSearchService.addProvider(contractSearchProvider);
    TicketingSearchService.addProvider(userSearchProvider);

    TicketingTicketLiveUpdateInitializer.start();

    esnModuleRegistry.add(TICKETING_MODULE_METADATA);
  });
})(angular);
