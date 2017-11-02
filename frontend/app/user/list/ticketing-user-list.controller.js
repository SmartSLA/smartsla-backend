(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserListController', TicketingUserListController);

  function TicketingUserListController(
    $scope,
    $modal,
    _,
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
      self.onEditBtnClick = onEditBtnClick;
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);

      $scope.$on(TICKETING_USER_EVENTS.USER_CREATED, function(event, user) {
        _onUserCreated(user);
      });

      $scope.$on(TICKETING_USER_EVENTS.USER_UPDATED, function(event, updatedUser) {
        _onUserUpdated(updatedUser);
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

    function onEditBtnClick(user) {
      user.email = user.preferredEmail;
      $modal({
        templateUrl: '/ticketing/app/user/update/ticketing-user-update.html',
        backdrop: 'static',
        placement: 'center',
        controller: 'TicketingUserUpdateController',
        controllerAs: '$ctrl',
        locals: {
          user: user
        }
      });
    }

    function _onUserCreated(user) {
      if (!user) {
        return;
      }

      self.elements.unshift(user);
    }

    function _onUserUpdated(updatedUser) {
      if (!updatedUser || !updatedUser._id) {
        return;
      }

      var index = _.findIndex(self.elements, { _id: updatedUser._id });

      if (index !== -1) {
        self.elements[index] = updatedUser;
      }
    }
  }
})(angular);
