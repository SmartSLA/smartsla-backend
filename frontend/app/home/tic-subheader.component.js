(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .component('ticSubheader', ticSubheader());

  function ticSubheader() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/home/tic-subheader.html'
    };

    return component;
  }

})();
