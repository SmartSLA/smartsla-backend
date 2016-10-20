(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticClientViewCard', ticClientViewCard());

  function ticClientViewCard() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/client/view/tic-client-view-card.html',
      controllerAs: 'ctrl',
      bindings: {
        client: '=',
        getClientLogo: '='
      }
    };

    return component;
  }
})();
