(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticGroupFormController', ticGroupFormController);

  function ticGroupFormController($scope) {
    var self = this;

    $scope.group = self.group;
    self.formName = self.formName || 'form';

    self.$postLink = function() {
      self.form = $scope[self.formName];
    };
 }
})();
