(function() {
    'use strict';

    angular.module('linagora.esn.ticketing')
      .controller('ticGroupsListController', ticGroupsListController);

    function ticGroupsListController($stateParams, $q, ticClientApiService) {
      var self = this;

      self.$onInit = $onInit;

      ////////////

      function $onInit() {
        if ($stateParams.client) {
          self.groups = $stateParams.client.groups;
        } else if ($stateParams.clientId) {
          return ticClientApiService.getClient($stateParams.clientId).then(function(result) {
            self.groups = result.data.groups;
          });
        }
      }
    }
  })();
