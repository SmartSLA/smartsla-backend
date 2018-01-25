(function(angular) {
  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketActivitiesController', TicketingTicketActivitiesController);

  function TicketingTicketActivitiesController(
    $scope,
    _,
    infiniteScrollHelper,
    esnI18nService,
    TicketingTicketClient,
    TICKETING_TICKET_EVENTS
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
      $scope.$on(TICKETING_TICKET_EVENTS.UPDATED, _onTicketUpdated);
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return TicketingTicketClient.getActivities(self.ticketId, options)
        .then(function(response) {
          return _.map(response.data, function(activity) {
            activity.changeset = _.map(activity.changeset, function(change) {
              change.displayName = esnI18nService.translate(change.displayName).toString();

              return change;
            });

            return activity;
          });
        });
    }

    function _onTicketUpdated(event, activity) {
      if (!activity) {
        return;
      }

      activity.changeset = _.map(activity.changeset, function(change) {
        change.displayName = esnI18nService.translate(change.displayName).toString();

        return change;
      });

      self.elements.unshift(activity);
    }
  }
})(angular);
