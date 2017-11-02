(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractFormController', TicketingContractFormController);

  function TicketingContractFormController($scope) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      $scope.newManagers = self.contract && self.contract.manager ? [self.contract.manager] : [];
      $scope.newDefaultSupportManagers = self.contract && self.contract.defaultSupportManager ? [self.contract.defaultSupportManager] : [];
      $scope.$watch('newManagers', function() {
        if (self.contract) {
          self.contract.manager = $scope.newManagers.length ? $scope.newManagers[0] : null;
        }
      }, true);

      $scope.$watch('newDefaultSupportManagers', function() {
        if (self.contract) {
          self.contract.defaultSupportManager = $scope.newDefaultSupportManagers.length ? $scope.newDefaultSupportManagers[0] : null;
        }
      }, true);
    }
  }
})(angular);
