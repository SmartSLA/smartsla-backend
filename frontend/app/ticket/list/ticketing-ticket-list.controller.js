(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketListController', TicketingTicketListController);

  function TicketingTicketListController(
    $scope,
    $modal,
    infiniteScrollHelper,
    TicketingTicketService,
    TICKETING_TICKET_EVENTS
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
      self.onCreateBtnClick = onCreateBtnClick;

      $scope.$on(TICKETING_TICKET_EVENTS.CREATED, function(event, createdTicket) {
        _onTicketCreated(createdTicket);
      });
    }

    function onCreateBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/ticket/create/ticketing-ticket-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingTicketCreateController'
      });
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return TicketingTicketService.list(options);
    }

    function _onTicketCreated(createdTicket) {
      if (!createdTicket) {
        return;
      }

      self.elements.unshift(createdTicket);
    }
  }
})(angular);
