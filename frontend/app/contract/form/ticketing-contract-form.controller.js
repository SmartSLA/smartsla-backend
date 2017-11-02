(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractFormController', TicketingContractFormController);

  function TicketingContractFormController($scope) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      $scope.newManagers = self.contract && self.contract.manager ? [self.contract.manager] : [];
      $scope.newDefaultSupportManagerManagers = self.contract && self.contract.defaultSupportManager ? [self.contract.defaultSupportManager] : [];
      $scope.$watch('newManagers', function() {
        if (self.contract) {
          self.contract.manager = $scope.newManagers.length ? $scope.newManagers[0] : null;
        }
      }, true);

      $scope.$watch('newDefaultSupportManagerManagers', function() {
        if (self.contract) {
          self.contract.defaultSupportManager = $scope.newDefaultSupportManagerManagers.length ? $scope.newDefaultSupportManagerManagers[0] : null;
        }
      }, true);
    }
  }
})(angular);
