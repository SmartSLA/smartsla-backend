(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticGroupAddSubheader', ticGroupAddSubheader());

  function ticGroupAddSubheader() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/group/add/tic-group-add-subheader',
      controllerAs: 'ctrl',
      bindings: {
        createGroup: '&',
        form: '<'
      }
    };

    return component;
  }
})();
