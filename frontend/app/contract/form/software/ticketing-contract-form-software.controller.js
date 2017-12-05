(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractFormSoftwareController', TicketingContractFormSoftwareController);

  function TicketingContractFormSoftwareController(
    $scope,
    TicketingContractService,
    _
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.onAddBtnClick = onAddBtnClick;
      self.existingSoftwareIds = _getExistingSoftwareIds(self.contract);
      self.softwareAvailableTypes = _getSoftwareAvailableTypes();

      $scope.newSoftware = self.softwareTemplate || [];
      self.software = {};
      $scope.$watch('newSoftware', function() {
        self.softwareTemplate = $scope.newSoftware.length ? $scope.newSoftware[0] : {};
        self.software = {
          template: self.softwareTemplate,
          versions: []
        };
      }, true);
    }

    function onAddBtnClick(form) {
      return TicketingContractService.addSoftware(self.contract._id, self.software)
        .then(function() {
          form.$setUntouched(); // reset form to untouched state
          self.existingSoftwareIds = _getExistingSoftwareIds(self.contract);
          $scope.newSoftware = [];
          self.software = {};
        });
    }

    function _getExistingSoftwareIds(contract) {
      return _.map(contract.software, function(item) {
        return item.template._id;
      });
    }

    function _getSoftwareAvailableTypes() {
      var availableTypes = _.map(self.contract.demands, function(demand) {
        return demand.softwareType;
      });

      availableTypes = availableTypes.filter(function(value, index) {
        return availableTypes.indexOf(value) === index;
      }).filter(Boolean);

      return availableTypes;
    }
  }
})(angular);
