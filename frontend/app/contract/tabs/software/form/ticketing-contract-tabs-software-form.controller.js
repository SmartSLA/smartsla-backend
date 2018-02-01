(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingContractTabsSoftwareFormController', TicketingContractTabsSoftwareFormController);

  function TicketingContractTabsSoftwareFormController() {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.onSoftwareChange = onSoftwareChange;
      self.softwareAutocompleteOptions = { excludedIds: self.existingSoftwareIds };
    }

    function onSoftwareChange() {
      self.softwareTemplate = self.newSoftware.length ? self.newSoftware[0] : null;
      self.software = {
        template: self.softwareTemplate,
        versions: []
      };
    }
  }
})(angular);
