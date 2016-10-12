(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticRestangular', ticRestangular);

  function ticRestangular(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/linagora.esn.ticketing/api');
      RestangularConfigurer.setFullResponse(true);
    });
  }
})();
