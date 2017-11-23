(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationSelectionListSubheaderController', TicketingOrganizationSelectionListSubheaderController);

  function TicketingOrganizationSelectionListSubheaderController(
    TicketingSelectionService
  ) {
    var self = this;

    self.$onInit = $onInit;
    self.isSelecting = isSelecting;
    self.getNumberOfSelectedItems = getNumberOfSelectedItems;

    function $onInit() {
      self.isSelectedAll = false;
    }

    function isSelecting() {
      return TicketingSelectionService.isSelecting();
    }

    function getNumberOfSelectedItems() {
      return TicketingSelectionService.getSelectedItems().length;
    }
  }
})(angular);
