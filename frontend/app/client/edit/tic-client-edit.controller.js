(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .controller('ticClientEditController', ticClientEditController);

   function ticClientEditController($stateParams, ticClientApiService) {
     var self = this;

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
