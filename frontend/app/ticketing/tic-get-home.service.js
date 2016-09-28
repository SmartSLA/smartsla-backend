(function() {
  /*eslint strict: [2, "function"]*/

  'use strict';

  angular.module('linagora.esn.ticketing')
         .factory('ticGetHome', ticGetHome);

  ticGetHome.$inject = [
    '$http'
  ];

  function ticGetHome($http) {
    return $http.get('/linagora.esn.ticketing/ticketing').then(function(response) {
      return response.data.message;
    });
  }

})();
