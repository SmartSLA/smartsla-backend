(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .directive('ticApplicationMenu', ticApplicationMenu);

  function ticApplicationMenu(applicationMenuTemplateBuilder) {
    var directive = {
      restrict: 'E',
      template: applicationMenuTemplateBuilder('/#/ticketing', 'ticketing', 'Ticketing'),
      replace: true
    };

    return directive;
  }
})();
