(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractTabsSoftwareFormController', TicketingContractTabsSoftwareFormController);

  function TicketingContractTabsSoftwareFormController($scope) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      if (!self.editMode) {
        $scope.newSoftware = [];
        $scope.$watch('newSoftware', function() {
          self.softwareTemplate = $scope.newSoftware.length ? $scope.newSoftware[0] : {};
          self.software = {
            template: self.softwareTemplate,
            versions: []
          };
        }, true);
      }
    }
  }
})(angular);
