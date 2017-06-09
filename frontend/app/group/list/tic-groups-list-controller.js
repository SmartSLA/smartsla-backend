(function() {
    'use strict';

    angular.module('linagora.esn.ticketing')
      .controller('ticGroupsListController', ticGroupsListController);

    function ticGroupsListController($stateParams, $q, ticClientApiService) {
      var self = this;

      _initClient()
        .then(function(client) {
          if (client && client.groups) {
            self.groups = client.groups;
          }
        });

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
    }
  })();
