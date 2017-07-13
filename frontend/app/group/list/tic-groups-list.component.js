(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticGroupsList', ticGroupsList());

  function ticGroupsList() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/group/list/tic-groups-list.html',
      controller: 'ticGroupsListController',
      controllerAs: 'ctrl',
      bindings: {
        client: '<',
        showAddGroupButton: '<',
        showDeleteGroupButton: '<'
      }
    };

    return component;
  }
})();
