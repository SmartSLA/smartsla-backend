(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrderFormController', TicketingOrderFormController);

  function TicketingOrderFormController($scope) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      $scope.newManagers = self.order && self.order.manager ? [self.order.manager] : [];
      $scope.newDefaultSupportManagers = self.order && self.order.defaultSupportManager ? [self.order.defaultSupportManager] : [];
      $scope.newDefaultSupportTechnicians = self.order && self.order.defaultSupportTechnicians ? [self.order.defaultSupportTechnicians] : [];

      $scope.$watch('newManagers', function() {
        if (self.order) {
          self.order.manager = $scope.newManagers.length ? $scope.newManagers[0] : null;
        }
      }, true);

      $scope.$watch('newDefaultSupportManagers', function() {
        if (self.order) {
          self.order.defaultSupportManager = $scope.newDefaultSupportManagers.length ? $scope.newDefaultSupportManagers[0] : null;
        }
      }, true);

      $scope.$watch('newDefaultSupportTechnicians', function() {
        if (self.order) {
          self.order.defaultSupportTechnician = $scope.newDefaultSupportTechnicians.length ? $scope.newDefaultSupportTechnicians[0] : null;
        }
      }, true);
    }
  }
})(angular);
