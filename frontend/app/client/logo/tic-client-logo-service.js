(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .factory('ticClientLogoService', ticClientLogoService);

  function ticClientLogoService() {

    return {
      getClientLogo: getClientLogo
    };

    ////////////

    function getClientLogo(client) {
      if (client) {
        if (client.logoAsBase64) {
          return client.logoAsBase64;
        } else if (client.logo) {
          return String('/api/files/' + client.logo);
        }
      }

      return '/linagora.esn.ticketing/app/client/logo/default_logo.png';
    }
  }
})();
