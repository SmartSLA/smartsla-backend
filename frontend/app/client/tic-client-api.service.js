(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .factory('ticClientApiService', ticClientApiService);

  function ticClientApiService(ticRestangular) {
    return {
      getClients: getClients
    };

    ////////////

    function getClients() {
      ticRestangular.all('clients').getList();
    }
  }
})();
