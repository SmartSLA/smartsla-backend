(function() {
  'use strict';

  var MODULE_NAME = 'linagora.esn.ticketing';

  angular.module(MODULE_NAME)
    .directive('ticketingApplicationMenu', ticketingApplicationMenu);

  function ticketingApplicationMenu(applicationMenuTemplateBuilder) {
    var directive = {
      restrict: 'E',
      template: applicationMenuTemplateBuilder('/#/ticketing', 'ticketing', 'Ticketing'),
      replace: true
    };

    return directive;
  }
})();
