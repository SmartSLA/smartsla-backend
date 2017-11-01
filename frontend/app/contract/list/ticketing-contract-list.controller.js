(function(angular) {
  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractListController', TicketingContractListController);

  function TicketingContractListController(
    $state,
    infiniteScrollHelper,
    ticketingContractClient
  ) {
    var self = this;
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.onItemClick = onItemClick;
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return ticketingContractClient.list(options)
        .then(function(response) {
          return response.data;
        });
    }

    function onItemClick(contractId) {
      $state.go('ticketingAdminCenter.contract.detail', { contractId: contractId });
    }
  }
})(angular);
