(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientView', ticClientView());

  function ticClientView() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/view/tic-client-view.html',
      controller: 'ticClientViewController',
      controllerAs: 'ctrl'
    };

    return component;
  }
})();
