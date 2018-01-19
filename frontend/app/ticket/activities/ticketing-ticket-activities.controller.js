(function(angular) {
  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketActivitiesController', TicketingTicketActivitiesController);

  function TicketingTicketActivitiesController(TicketingTicketClient, infiniteScrollHelper) {
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

      return TicketingTicketClient.getActivities(self.ticketId, options)
        .then(function(response) {
          return response.data;
        });
    }
  }
})(angular);
