(function(angular) {
  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationListController', TicketingOrganizationListController);

  function TicketingOrganizationListController(
    $scope,
    $state,
    $modal,
    infiniteScrollHelper,
    ticketingOrganizationClient,
    TicketingOrganizationService,
    TICKETING_ORGANIZATION_EVENTS
  ) {
    var self = this;
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
      self.onCreateBtnClick = onCreateBtnClick;
      if (self.parent) {
        options.parent = self.parent._id;
      }

      $scope.$on(TICKETING_ORGANIZATION_EVENTS.ORGANIZATION_CREATED, function(event, organization) {
        _onOrganizationCreated(organization);
      });
    }

    function onCreateBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/organization/create/ticketing-organization-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingOrganizationCreateController',
        locals: {
          parent: self.parent
        }
      });
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return ticketingOrganizationClient.list(options)
        .then(function(response) {
          return response.data;
        });
    }

    function _onOrganizationCreated(organization) {
      if (!organization) {
        return;
      }

      self.elements.unshift(organization);
    }
  }
})(angular);
