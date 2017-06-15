(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticGroupDeleteModalController', ticGroupDeleteModalController);

  function ticGroupDeleteModalController($stateParams, $state, ticGroupApiService, ticClientApiService, ticNotificationFactory, _) {
    var self = this;

    self.deleteGroup = deleteGroup;
    initClient();
    ////////////

    function initClient() {
      if ($stateParams.client) {
        self.client = $stateParams.client;
      } else if ($stateParams.clientId) {
        ticClientApiService.getClient($stateParams.clientId).then(function(result) {
          self.client = result.data;
        });
      }
    }

    function deleteGroup(group) {
      if (group._id) {
        return ticGroupApiService.deleteGroup(group._id)
        .then(function() {
          _.remove(self.client.groups, function(_group) { return _group._id === group._id; });
          $state.go('ticketing.client-edit', { clientId: self.client._id, client: self.client });

          ticNotificationFactory.weakInfo('Success', 'Group deleted');
        }, function(response) {
          var error = response.data.error;

          ticNotificationFactory.weakError('Error', error);
        });
      }
      _.remove(self.client.groups, function(_group) { return _group === group; });
      $state.go('ticketing.client-edit', { clientId: self.client._id, client: self.client });
      ticNotificationFactory.weakInfo('Success', 'Group deleted');
    }
  }
})();
