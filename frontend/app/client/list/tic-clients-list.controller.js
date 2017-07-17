(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .controller('ticClientsListController', ticClientsListController);

   function ticClientsListController(ticClientApiService, ticClientLogoService) {
     var self = this;

     self.$onInit = $onInit;

     self.getClientLogo = ticClientLogoService.getClientLogo;

     /////////////////

     function $onInit() {
      ticClientApiService.getClients().then(function(result) {
        self.clients = result.data;
      });
    }
  }
})();
