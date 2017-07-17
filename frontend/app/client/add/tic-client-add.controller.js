(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientAddController', ticClientAddController);

  function ticClientAddController($stateParams, $state, ticNotificationFactory, ticClientApiService, ticGroupApiService, ticClientLogoService) {
    var self = this;

    self.$onInit = $onInit;

    self.createClient = createClient;

    ////////////

    function $onInit() {
      // self.client must be initialized to make logo picker work.
      self.client = {
        is_active: true,
        groups: []
      };

      if ($stateParams.client) {
        self.client = $stateParams.client;
      }
    }

    function createClient() {
      if (self.form && self.form.$invalid) {
        return ticNotificationFactory.weakError('Error', 'Client is not valid');
      }

      ticClientLogoService.handleLogoUpload(self.client)
        .then(ticGroupApiService.createGroups)
        .then(ticClientApiService.createClient)
        .then(function(client) {
          $state.go('ticketing.client-view', {clientId: client.data._id, client: client.data});

          ticNotificationFactory.weakInfo('Success', 'Client Created');
        }, function(response) {
          var error = response.data.error;

          ticNotificationFactory.weakError('Error', error.message);
        });
    }
  }
})();
