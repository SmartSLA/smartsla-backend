(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientFormController', ticClientFormController);

  function ticClientFormController($scope, ticClientLogoService) {
    var self = this;

    $scope.client = self.client;
    self.getClientLogo = ticClientLogoService.getClientLogo;
 }
})();
