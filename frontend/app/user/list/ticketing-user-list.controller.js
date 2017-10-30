(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserListController', TicketingUserListController);

  function TicketingUserListController(infiniteScrollHelper, ticketingUserClient) {
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

      return ticketingUserClient.list(options)
        .then(function(response) {
          console.log('aa: ', response.data);
          return response.data;
        });
    }
  }
})(angular);
