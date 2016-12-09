(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticGroupAddController', ticGroupAddController);

  function ticGroupAddController($stateParams, esnPreviousState, ticNotificationFactory, ticGroupApiService) {
    var self = this;

    self.createGroup = createGroup;
    initGroup();

    ////////////

    function initGroup() {
      self.group = {
        is_active: true
      };

      if ($stateParams.client) {
        self.group.client = $stateParams.client._id;
        self.group.address = $stateParams.client.address;
        self.group.preferred_contact = $stateParams.client.preferred_contact;
      }
    }

    function createGroup() {
      if (self.form && self.form.$invalid) {
        return ticNotificationFactory.weakError('Error', 'Group is not valid');
      }

      return ticGroupApiService.createGroup(self.group)
        .then(function() {
          esnPreviousState.go();

          ticNotificationFactory.weakInfo('Success', 'Group created');
        }, function(response) {
          var error = response.data.error;

          ticNotificationFactory.weakError('Error', error.message);
        });
    }
  }
})();
