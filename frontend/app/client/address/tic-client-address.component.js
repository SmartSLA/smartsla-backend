(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientAddress', ticClientAddress());

  function ticClientAddress() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/address/tic-client-address',
      controllerAs: 'ctrl',
      bindings: {
        address: '<'
      }
    };

    return component;
  }
})();
