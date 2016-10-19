(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientAddController', ticClientAddController);

  function ticClientAddController($scope, $state, notificationFactory, ticClientApiService, ticClientLogoService) {
    this.createClient = createClient;
    this.getClientLogo = ticClientLogoService.getClientLogo;
    this.cancel = cancel;
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

            _createClientAndNotify();
          }, function(error) {
            notificationFactory.weakError('Error', 'Error ' + error.message);
          });
      } else {
        _createClientAndNotify();
      }
    }

    function _createClientAndNotify() {
      return ticClientApiService.createClient($scope.client)
        .then(function() {
          notificationFactory.weakInfo('Success', 'Client Created');
          $state.go('ticketing.home');
        }, function(error) {
          notificationFactory.weakError('Error', 'Error ' + error.message);
        });
    }

    function cancel() {
      $state.go('ticketing.home');
    }
  }
})();
