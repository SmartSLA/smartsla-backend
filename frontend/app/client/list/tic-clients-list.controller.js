(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .controller('ticClientsListController', ticClientsListController);

   function ticClientsListController(ticClientApiService, ticClientLogoService) {
     var self = this;

     self.getClientLogo = ticClientLogoService.getClientLogo;

     exposeClientsToScope();

     /////////////////

     function exposeClientsToScope() {
      ticClientApiService.getClients().then(function(result) {
        self.clients = result.data;
      });
    }
  }
})();
