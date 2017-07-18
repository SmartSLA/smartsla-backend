(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientEditController', ticClientEditController);

  function ticClientEditController($stateParams, $state, ticNotificationFactory, ticClientApiService, ticGroupApiService, ticClientLogoService) {
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
        .then(ticGroupApiService.createGroups)
        .then(ticClientApiService.updateClient)
        .then(function() {
          $state.go('ticketing.client-view', {clientId: self.client._id, client: self.client});

          ticNotificationFactory.weakInfo('Success', 'Client Updated');
        }, function(response) {
          var error = response.data.error;

          ticNotificationFactory.weakError('Error', error.message);
        });
    }
  }
})();
