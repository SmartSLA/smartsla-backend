(function(angular) {
  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationListController', TicketingOrganizationListController);

  function TicketingOrganizationListController(infiniteScrollHelper, ticketingOrganizationClient) {
    var self = this;
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return ticketingOrganizationClient.list(options)
        .then(function(response) {
          return response.data;
        });
    }
  }
})(angular);
