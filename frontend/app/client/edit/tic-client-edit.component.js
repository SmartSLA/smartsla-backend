(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientEdit', ticClientEdit());

  function ticClientEdit() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/edit/tic-client-edit.html',
      controller: 'ticClientEditController',
      controllerAs: 'ctrl'
    };

    return component;
  }
})();
