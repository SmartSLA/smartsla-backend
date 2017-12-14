(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(
    dynamicDirectiveService,
    session,
    TicketingSearchService,
    TicketingOrganizationService,
    TicketingSoftwareService,
    TicketingUserService,
    TicketingContractService
  ) {
    var group = new dynamicDirectiveService.DynamicDirective(true, 'ticketing-application-menu', { priority: -10 });
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

    dynamicDirectiveService.addInjection('esn-application-menu', group);
  });
})(angular);
