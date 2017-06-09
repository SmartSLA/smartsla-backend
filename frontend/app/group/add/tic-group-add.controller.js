(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticGroupAddController', ticGroupAddController);

  function ticGroupAddController($stateParams, $state, ticNotificationFactory) {
    var self = this;

    self.createGroup = createGroup;
    initGroup();

    ////////////

    function initGroup() {
      self.group = {
        is_active: true
      };

      if ($stateParams.client) {
        self.client = $stateParams.client;
        self.client.groups = self.client.groups || [];
        self.group.client = $stateParams.client._id;
        self.group.address = $stateParams.client.address;
        self.group.preferred_contact = $stateParams.client.preferred_contact;
      }
    }

    function createGroup() {
      if (self.form && self.form.$invalid) {
        return ticNotificationFactory.weakError('Error', 'Group is not valid');
      }

      self.client.groups.push(self.group);
      if (self.client._id) {
        $state.go('ticketing.client-edit', {clientId: self.client._id, client: self.client});
        ticNotificationFactory.weakInfo('Success', 'Group added');
      } else {
        $state.go('ticketing.client-add', {client: self.client});
        ticNotificationFactory.weakInfo('Success', 'Group added');
      }
    }
  }
})();
