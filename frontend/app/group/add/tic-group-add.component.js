(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticGroupAdd', ticGroupAdd());

  function ticGroupAdd() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/group/add/tic-group-add.html',
      controller: 'ticGroupAddController',
      controllerAs: 'ctrl'
    };

    return component;
  }
})();
