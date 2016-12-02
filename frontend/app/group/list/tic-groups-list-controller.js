(function() {
    'use strict';

    angular.module('linagora.esn.ticketing')
      .controller('ticGroupsListController', ticGroupsListController);

    function ticGroupsListController($stateParams, $q, ticGroupApiService, ticClientApiService) {
      var self = this;

      _initClient()
        .then(_fetchGroups);

      ////////////

      function _initClient() {
        if ($stateParams.client) {
          return $q.when($stateParams.client);
        } else if ($stateParams.clientId) {
          return ticClientApiService.getClient($stateParams.clientId).then(function(result) {
            return result.data;
          });
        }

        return $q.when();
      }

      function _fetchGroups(client) {
        if (client && client.groups) {
          return ticGroupApiService.getClientGroups(client.groups).then(function(result) {
            self.groups = result.data;
          });
        }
      }
    }
  })();
