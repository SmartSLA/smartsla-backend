(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientFormController', ticClientFormController);

  function ticClientFormController($scope, ticClientLogoService) {
    var self = this;

    $scope.client = self.client;
    self.formName = self.formName || 'form';
    self.getClientLogo = ticClientLogoService.getClientLogo;

    self.$postLink = function() {
      self.form = $scope[self.formName];
    };
 }
})();
