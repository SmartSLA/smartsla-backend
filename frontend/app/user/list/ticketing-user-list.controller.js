(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserListController', TicketingUserListController);

  function TicketingUserListController(
    $scope,
    $modal,
    infiniteScrollHelper,
    ticketingUserClient,
    TICKETING_USER_EVENTS
  ) {
    var self = this;
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.onCreateBtnClick = onCreateBtnClick;
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);

      $scope.$on(TICKETING_USER_EVENTS.USER_CREATED, function(event, user) {
        _onUserCreated(user);
      });
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return ticketingUserClient.list(options)
        .then(function(response) {
          return response.data;
        });
    }

    function onCreateBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/user/create/ticketing-user-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingUserCreateController'
      });
    }

    function _onUserCreated(user) {
      if (!user) {
        return;
      }

      self.elements.unshift(user);
    }
  }
})(angular);
