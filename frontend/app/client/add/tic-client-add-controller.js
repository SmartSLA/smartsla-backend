(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientAddController', ticClientAddController);

  function ticClientAddController($state, ticNotificationFactory, ticClientApiService) {
    var self = this;

    self.createClient = createClient;
    // Early initialization to make logo picker work.
    self.client = {};

    ////////////

    function createClient() {
      if (self.client.avatarUploader) {
        self.client.avatarUploader.start();
        self.client.avatarUploader.await(
          function(result) {
            self.client.logo = result[0].response.data._id;
            delete self.client.avatarUploader;
            delete self.client.logoAsBase64;

            _createClientAndNotify();
          }, function(error) {
            ticNotificationFactory.weakError('Error', error.message);
          });
      } else {
        _createClientAndNotify();
      }
    }

    function _createClientAndNotify() {
      return ticClientApiService.createClient(self.client)
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
