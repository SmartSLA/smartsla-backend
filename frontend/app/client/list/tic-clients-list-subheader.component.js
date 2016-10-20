(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientsListSubheader', ticClientListSubheader());

  function ticClientListSubheader() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/list/tic-clients-list-subheader',
      controllerAs: 'ctrl'
    };

    return component;
  }
})();
