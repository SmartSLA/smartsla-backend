(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientViewSubheader', ticClientViewSubheader());

  function ticClientViewSubheader() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/view/tic-client-view-subheader',
      controllerAs: 'ctrl',
      bindings: {
        client: '='
      }
    };

    return component;
  }
})();
