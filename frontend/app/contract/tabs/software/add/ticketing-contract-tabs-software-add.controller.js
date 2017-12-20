(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractTabsSoftwareAddController', TicketingContractTabsSoftwareAddController);

  function TicketingContractTabsSoftwareAddController(
    _,
    TicketingContractService,
    contract
  ) {
    var self = this;

    init();

    function init() {
      self.contract = contract;
      self.onAddBtnClick = onAddBtnClick;

      self.existingSoftwareIds = _getExistingSoftwareIds(self.contract);
      self.availableSoftwareTypes = _getAvailableSoftwareTypes(self.contract);
    }

    function onAddBtnClick(form) {
      return TicketingContractService.addSoftware(self.contract._id, self.newSoftware)
        .then(function() {
          form.$setUntouched(); // reset form to untouched state
          self.existingSoftwareIds = _getExistingSoftwareIds(self.contract);
          self.newSoftware = {};
        });
    }

    function _getExistingSoftwareIds(contract) {
      return _.map(contract.software, function(item) {
        return item.template._id;
      });
    }

    function _getAvailableSoftwareTypes(contract) {
      var availableTypes = _.map(contract.demands, function(demand) {
        return demand.softwareType;
      });

      // unique the array of available types
      availableTypes = availableTypes.filter(function(value, index) {
        return availableTypes.indexOf(value) === index;
      }).filter(Boolean);

      return availableTypes;
    }
  }
})(angular);
