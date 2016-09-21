(function() {
  /*eslint strict: [2, "function"]*/

  'use strict';

  angular.module('linagora.esn.ticketing')
         .controller('ticController', ticController);

  ticController.$inject = [
    '$scope',
    'ticGetHome'
  ];

   function ticController(
     $scope,
     ticGetHome) {
      ticGetHome.then(function(message) {
        $scope.message = message;
      });
    }

})();
