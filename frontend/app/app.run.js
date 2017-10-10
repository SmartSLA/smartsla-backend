(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .run(function(dynamicDirectiveService) {
    var group = new dynamicDirectiveService.DynamicDirective(true, 'ticketing-application-menu', { priority: -10 });

    dynamicDirectiveService.addInjection('esn-application-menu', group);
  });
})(angular);
