(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientEditSubheader', ticClientEditSubheader());

  function ticClientEditSubheader() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/edit/tic-client-edit-subheader',
      controllerAs: 'ctrl',
      bindings: {
        form: '<',
        updateClient: '&'
      }
    };

    return component;
  }
})();
