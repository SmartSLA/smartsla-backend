(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSelectionSelectAllController', TicketingSelectionSelectAllController);

  function TicketingSelectionSelectAllController(
    $scope,
    TicketingSelectionService
  ) {
    var self = this;

    self.$onInit = $onInit;
    self.$onDestroy = $onDestroy;
    self.toggleSelectAll = toggleSelectAll;

    function $onInit() {
      $scope.$watch(function() {
        return self.items.length && self.items.length === TicketingSelectionService.getSelectedItems().length;
      }, function(isSelectedAll) {
        self.isSelectedAll = !!isSelectedAll;
      });
    }

    function $onDestroy() {
      TicketingSelectionService.unselectAllItems();
    }

    function toggleSelectAll() {
      if (self.form) {
        self.form.$setDirty();
      }

      if (self.isSelectedAll) {
        self.isSelectedAll = false;
        TicketingSelectionService.unselectAllItems();
      } else {
        self.isSelectedAll = true;
        self.items.forEach(function(item) {
          TicketingSelectionService.toggleItemSelection(item, self.isSelectedAll);
        });
      }
    }
  }
})(angular);
