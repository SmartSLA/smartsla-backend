'use strict';

angular.module('linagora.esn.ticketing')

  .component('ticSubheaderButton', {
    templateUrl: '/linagora.esn.ticketing/app/subheader/tic-subheader-button.html',
    bindings: {
      ticDisabled: '=?',
      ticClick: '&?',
      ticIconClass: '@?',
      ticIconText: '@?',
      ticIconPosition: '@?'
    },
    controllerAs: 'ctrl'
  });
