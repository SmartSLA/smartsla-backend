(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .directive('ticketingSelectable', ticketingSelectable);

  function ticketingSelectable(TicketingSelectionService) {
    return {
      require: '^form',
      restrict: 'E',
      transclude: true,
      templateUrl: '/ticketing/app/common/selection/ticketing-selectable.html',
      link: function(scope, element, attrs, ngFormController) {
        if (scope.item.selected) {
          TicketingSelectionService.toggleItemSelection(scope.item, true);
        }

        scope.toggle = function() {
          TicketingSelectionService.toggleItemSelection(scope.item);
          ngFormController.$setDirty();
        };
      },
      scope: {
        item: '='
      }
    };
  }
})(angular);
