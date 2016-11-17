(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientAddSubheader', ticClientAddSubheader());

  function ticClientAddSubheader() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/add/tic-client-add-subheader',
      controllerAs: 'ctrl',
      bindings: {
        createClient: '&'
      }
    };

    return component;
  }

})();
