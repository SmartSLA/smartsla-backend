(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .component('ticClientsList', ticClientsList());

  function ticClientsList() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/list/tic-clients-list.html',
      controller: 'ticClientsListController',
      controllerAs: 'ctrl'
    };

    return component;
  }
})();
