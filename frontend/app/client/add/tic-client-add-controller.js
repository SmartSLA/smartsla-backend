(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientAddController', ticClientAddController);

  function ticClientAddController($scope, $state, ticNotificationFactory, ticClientApiService, ticClientLogoService) {
    this.createClient = createClient;
    this.getClientLogo = ticClientLogoService.getClientLogo;
    $scope.client = {};

    ////////////

    function createClient(form) {
      if (form.$invalid) {
        return;
      }

      if ($scope.client.avatarUploader) {
        $scope.client.avatarUploader.start();
        $scope.client.avatarUploader.await(
          function(result) {
            $scope.client.logo = result[0].response.data._id;
            delete $scope.client.avatarUploader;
            delete $scope.client.logoAsBase64;

            _createClientAndNotify();
          }, function(error) {
            ticNotificationFactory.weakError('Error', error.message);
          });
      } else {
        _createClientAndNotify();
      }
    }

    function _createClientAndNotify() {
      return ticClientApiService.createClient($scope.client)
        .then(function() {
          ticNotificationFactory.weakInfo('Success', 'Client Created');
          $state.go('ticketing.home');
        }, function(response) {
          var error = response.data.error;

          ticNotificationFactory.weakError('Error', error.message);
        });
    }
  }
})();
