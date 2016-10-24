(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientViewController', ticClientViewController);

   function ticClientViewController($stateParams, ticClientLogoService, ticClientApiService) {
     var self = this;

     this.getClientLogo = ticClientLogoService.getClientLogo;

     getClient();

     /////////////////

     function getClient() {
       if ($stateParams.client) {
         self.client = $stateParams.client;

         return;
       }

       return ticClientApiService.getClient($stateParams.clientId).then(function(result) {
         self.client = result.data;
       });
     }
   }
})();
