(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .controller('ticHomeController', ticHomeController);

  ticHomeController.$inject = [
    '$scope',
    'ticGetHome'
  ];

   function ticHomeController(
     $scope,
     ticGetHome) {
      ticGetHome.then(function(message) {
        $scope.message = message;
      });
    }

})();
