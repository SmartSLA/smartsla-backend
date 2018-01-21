(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketListController', TicketingTicketListController);

  function TicketingTicketListController(
    $scope,
    $modal,
    session,
    infiniteScrollHelper,
    TicketingTicketService,
    TICKETING_TICKET_EVENTS,
    TICKETING_USER_ROLES,
    TICKETING_TICKET_STATES
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
    self.getIconFromState = getIconFromState;

    function $onInit() {
      options.scope = self.scope;
      options.state = self.state;
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
      self.onCreateBtnClick = onCreateBtnClick;
      self.canCreateTicket = canCreateTicket;

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

    function canCreateTicket() {
      return session.user.role === TICKETING_USER_ROLES.administrator && self.state === DEFAULT_STATE;
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

    function getIconFromState(state) {
      var key = Object.keys(TICKETING_TICKET_STATES).filter(function(key) {
        return TICKETING_TICKET_STATES[key].value === state;
      })[0];

      return TICKETING_TICKET_STATES[key].icon;
    }
  }
})(angular);
