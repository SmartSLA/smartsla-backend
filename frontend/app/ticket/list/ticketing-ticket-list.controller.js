(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketListController', TicketingTicketListController);

  function TicketingTicketListController(
    infiniteScrollHelper,
    TicketingTicketService
  ) {
    var self = this;
    var DEFAULT_STATE = 'open';
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT,
      state: DEFAULT_STATE
    };

    self.$onInit = $onInit;

    function $onInit() {
      options.state = self.state;
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return TicketingTicketService.list(options);
    }
  }
})(angular);
