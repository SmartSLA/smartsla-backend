(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientEditController', ticClientEditController);

  function ticClientEditController($stateParams, esnPreviousState, ticNotificationFactory, ticClientApiService, ticClientLogoService) {
    var self = this;

    self.updateClient = updateClient;

    initClient();

    /////////////////

    function initClient() {
      if ($stateParams.client) {
        self.client = $stateParams.client;

        return;
      }

      return ticClientApiService.getClient($stateParams.clientId).then(function(result) {
        self.client = result.data;
      });
    }

    function updateClient() {
      if (self.form && self.form.$invalid) {
        return ticNotificationFactory.weakError('Error', 'Client is not valid');
      }

      ticClientLogoService.handleLogoUpload(self.client)
        .then(_updateClient)
        .then(function() {
          esnPreviousState.go();

          ticNotificationFactory.weakInfo('Success', 'Client Updated');
        }, function(response) {
          var error = response.data.error;

          ticNotificationFactory.weakError('Error', error.message);
        });
    }

    function _updateClient(client) {
      return ticClientApiService.updateClient(client._id, client);
    }
  }
})();
