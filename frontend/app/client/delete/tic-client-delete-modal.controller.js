(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientDeleteModalController', ticClientDeleteModalController);

  function ticClientDeleteModalController($state, $log, ticClientApiService, ticNotificationFactory) {
    var self = this;

    self.deleteClient = deleteClient;

    ////////////

    function deleteClient(id) {
      return ticClientApiService.deleteClient(id).then(function() {
        ticNotificationFactory.weakInfo('Success', 'Client Deleted');
        $state.go('ticketing.clients-list', {}, {reload: true});
      }, function(error) {
        ticNotificationFactory.weakError('Error', 'Error while deleting the client');
        $log.error('could not delete client', error.message);
      });
    }
  }
})();
