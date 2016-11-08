(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientAddEditFormController', ticClientAddEditFormController);

  function ticClientAddEditFormController($scope, ticClientLogoService) {
    var self = this;

    $scope.client = self.client;
    self.getClientLogo = ticClientLogoService.getClientLogo;
 }
})();
