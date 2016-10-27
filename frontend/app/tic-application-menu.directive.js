(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .directive('ticApplicationMenu', ticApplicationMenu);

  function ticApplicationMenu(applicationMenuTemplateBuilder) {
    var directive = {
      restrict: 'E',
      template: applicationMenuTemplateBuilder('/#/ticketing', 'mdi-library-books', 'Ticketing'),
      replace: true
    };

    return directive;
  }
})();
