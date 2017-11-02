(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserDetailController', TicketingUserDetailController);

  function TicketingUserDetailController(
    $stateParams,
    TicketingUserService
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.userId = $stateParams.userId;

      self.onCancelBtnClick = onCancelBtnClick;
      self.onEditBtnClick = onEditBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;
      self.selectedTab = 'main';

      TicketingUserService.get(self.userId)
        .then(function(user) {
          self.user = user;
          self.user.email = user.preferredEmail;
          self.selectedTab = 'main';
        });
    }

    function onCancelBtnClick() {
      self.isEditMode = false;
    }

    function onEditBtnClick() {
      self.isEditMode = true;
    }

    function onSaveBtnClick() {
      return TicketingUserService.update(self.user)
        .then(function() {
          self.isEditMode = false;
        });
    }
  }
})(angular);
