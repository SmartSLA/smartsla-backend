(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientViewController', ticClientViewController);

   function ticClientViewController(client, ticClientLogoService) {
     this.client = client;
     this.getClientLogo = ticClientLogoService.getClientLogo;
   }
})();
