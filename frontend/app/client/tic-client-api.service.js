(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .factory('ticClientApiService', ticClientApiService);

  function ticClientApiService(ticRestangular) {
    return {
      getClients: getClients,
      createClient: createClient,
      getClient: getClient
    };

    ////////////

    function getClients() {
      return ticRestangular.all('clients').getList();
    }

    function createClient(client) {
      return ticRestangular.all('clients').post(client);
    }

    function getClient(clientId) {
      return ticRestangular.all('clients').one(clientId).get();
    }
  }
})();
