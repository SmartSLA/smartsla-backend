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
    TicketingTicketLiveUpdateInitializer,
    ticketingUserClient,
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

    session.ready.then(function() {
      ticketingUserClient.getRole()
        .then(function(response) {
          session.user.role = response.data;
        });
    });

    esnModuleRegistry.add(TICKETING_MODULE_METADATA);
  });
})(angular);
