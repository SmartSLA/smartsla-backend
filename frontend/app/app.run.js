(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(
    session,
    TicketingSearchService,
    TicketingOrganizationService,
    TicketingSoftwareService,
    TicketingUserService,
    TicketingContractService,
    esnModuleRegistry,
    TICKETING_MODULE_METADATA
  ) {
    var organiztionSearchProvider = TicketingOrganizationService.getOrganizationSearchProvider();
    var entitySearchProvider = TicketingOrganizationService.getEntitySearchProvider();
    var softwareSearchProvider = TicketingSoftwareService.getSearchProvider();
    var contractSearchProvider = TicketingContractService.getSearchProvider();

    TicketingSearchService.addProvider(organiztionSearchProvider);
    TicketingSearchService.addProvider(entitySearchProvider);
    TicketingSearchService.addProvider(softwareSearchProvider);
    TicketingSearchService.addProvider(contractSearchProvider);

    session.ready.then(function() {
      var userSearchProvider = TicketingUserService.getSearchProvider(session.domain._id);

      TicketingSearchService.addProvider(userSearchProvider);
    });

    esnModuleRegistry.add(TICKETING_MODULE_METADATA);
  });
})(angular);
