(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrderDetailController', TicketingOrderDetailController);

  function TicketingOrderDetailController(
    $stateParams,
    $scope,
    $modal,
    TicketingOrderService,
    TicketingUserService
  ) {
    var self = this;
    var DEFAULT_TAB = 'main';
    var originOrder;

    self.$onInit = $onInit;

    function $onInit() {
      self.orderId = $stateParams.orderId;

      self.onCancelBtnClick = onCancelBtnClick;
      self.onEditBtnClick = onEditBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;

      TicketingOrderService.get(self.orderId)
        .then(function(order) {
          self.selectedTab = DEFAULT_TAB;

          if (order.manager) {
            order.manager = _denormalizeUser(order.manager);
          }
          if (order.defaultSupportManager) {
            order.defaultSupportManager = _denormalizeUser(order.defaultSupportManager);
          }
          if (order.defaultSupportTechnician) {
            order.defaultSupportTechnician = _denormalizeUser(order.defaultSupportTechnician);
          }

          self.order = order;
          originOrder = angular.copy(self.order);

          $scope.$watch('$ctrl.selectedTab', function(newTab) {
            if (newTab !== DEFAULT_TAB) {
              _reset();
            }
          }, true);
        });
    }

    function onCancelBtnClick() {
      _reset();
    }

    function onEditBtnClick() {
      self.isEditMode = true;
    }

    function onSaveBtnClick() {
      return TicketingOrderService.update(self.order)
        .then(function() {
          self.isEditMode = false;
          originOrder = angular.copy(self.order);
        });
    }

    function _reset() {
      if (self.isEditMode) {
        self.isEditMode = false;
        self.order = angular.copy(originOrder);
      }
    }

    function _denormalizeUser(user) {
      user.id = user._id;
      user.displayName = TicketingUserService.buildDisplayName(user) || user.preferredEmail;

      return user;
    }
  }
})(angular);
