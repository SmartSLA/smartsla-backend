(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrderListController', TicketingOrderListController);

  function TicketingOrderListController(
    $state,
    $scope,
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
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return ticketingContractClient.listOrders(self.contract._id, options)
        .then(function(response) {
          return response.data;
        });
    }
  }
})(angular);
