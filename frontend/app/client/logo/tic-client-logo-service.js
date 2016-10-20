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

      return (client && client.logo && String('/api/files/' + client.logo)) || '/linagora.esn.ticketing/app/client/logo/default_logo.png';
    }
  }
})();
