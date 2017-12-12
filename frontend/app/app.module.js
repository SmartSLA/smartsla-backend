(function() {
  'use strict';

  var MODULE_NAME = 'linagora.esn.ticketing';

  angular.module(MODULE_NAME, [
    'esn.http',
    'esn.router',
    'op.dynamicDirective',
    'restangular',
    'esn.async-action',
    'esn.scroll',
    'esn.attendee',
    'esn.core',
    'ui.select',
    'ngSanitize',
    'ngTagsInput',
    'esn.i18n',
    'esn.notification',
    'esn.session',
    'esn.domain',
    'esn.template'
  ]);
})();
