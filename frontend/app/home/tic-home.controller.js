(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
         .controller('ticHomeController', ticHomeController);

   function ticHomeController($scope) {
     $scope.message = 'Ticketing home!';
    }
})();
