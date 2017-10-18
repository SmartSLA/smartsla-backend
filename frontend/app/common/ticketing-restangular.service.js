(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticketingRestangular', ticketingRestangular);

  function ticketingRestangular(Restangular, httpErrorHandler) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setFullResponse(true);
      RestangularConfigurer.setBaseUrl('/ticketing/api');
      RestangularConfigurer.setErrorInterceptor(function(response) {
        if (response.status === 401) {
          httpErrorHandler.redirectToLogin();
        }

        return true;
      });
    });
  }
})(angular);
