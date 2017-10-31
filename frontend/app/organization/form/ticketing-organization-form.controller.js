(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationFormController', TicketingOrganizationFormController);

  function TicketingOrganizationFormController($scope) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      $scope.newManagers = _determineNewManagers(self.organization);
      $scope.$watch('newManagers', function() {
        if (self.organization) {
          self.organization.manager = $scope.newManagers.length ? $scope.newManagers[0] : null;
        }
      }, true);
    }

    function _determineNewManagers(organization) {
      return organization && organization.manager ? [organization.manager] : [];
    }
  }
})(angular);
