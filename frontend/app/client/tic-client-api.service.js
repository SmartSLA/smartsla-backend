(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .factory('ticClientApiService', ticClientApiService);

  function ticClientApiService(ticRestangular) {
    return {
      getClients: getClients,
      createClient: createClient
    };

    ////////////

    function getClients() {
      ticRestangular.all('clients').getList();
    }

    function createClient(client) {
      return ticRestangular.all('clients').post(client);
    }
  }
})();
