(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .factory('ticClientApiService', ticClientApiService);

  function ticClientApiService(ticRestangular) {
    return {
      getClients: getClients,
      createClient: createClient,
      updateClient: updateClient,
      getClient: getClient,
      deleteClient: deleteClient
    };

    ////////////

    function getClients() {
      return ticRestangular.all('clients').getList();
    }

    function createClient(client) {
      return ticRestangular.all('clients').post(client);
    }

    function updateClient(client) {
      return ticRestangular.all('clients').one(client._id).customPUT(client);
    }

    function getClient(clientId) {
      return ticRestangular.all('clients').one(clientId).get();
    }

    function deleteClient(clientId) {
      return ticRestangular.all('clients').one(clientId).remove();
    }
  }
})();
