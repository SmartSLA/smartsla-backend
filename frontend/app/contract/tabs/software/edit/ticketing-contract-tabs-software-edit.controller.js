(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractTabsSoftwareEditController', TicketingContractTabsSoftwareEditController);

  function TicketingContractTabsSoftwareEditController(
    _,
    TicketingContractService,
    software,
    contractId
  ) {
    var self = this;

    init();

    function init() {
      self.software = software;
      self.onSaveBtnClick = onSaveBtnClick;
    }

    function onSaveBtnClick() {
      return TicketingContractService.updateSoftware(contractId, self.software);
    }
  }
})(angular);
