(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingSelectionService', TicketingSelectionService);

  function TicketingSelectionService(_) {
    var selectedItems = [],
        selecting = false;

    return {
      isSelecting: function() { return selecting; },
      getSelectedItems: function() { return _.clone(selectedItems); },
      toggleItemSelection: toggleItemSelection,
      unselectAllItems: unselectAllItems
    };

    function toggleItemSelection(item, shouldSelect) {
      var selected = angular.isDefined(shouldSelect) ? shouldSelect : !item.selected;

      item.selected = selected;

      if (selected && selectedItems.indexOf(item) === -1) {
        selectedItems.push(item);
      } else {
        _.pull(selectedItems, item);
      }

      selecting = selectedItems.length > 0;
    }

    function unselectAllItems() {
      selectedItems.forEach(function(item) {
        item.selected = false;
      });

      selectedItems.length = 0;
      selecting = false;
    }
  }
})(angular);
