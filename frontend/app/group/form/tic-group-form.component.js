(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .component('ticGroupForm', ticGroupForm());

  function ticGroupForm() {
    var component = {
      templateUrl: '/linagora.esn.ticketing/app/group/form/tic-group-form.html',
      controller: 'ticGroupFormController',
      controllerAs: 'ctrl',
      bindings: {
        group: '=',
        formName: '@?',
        form: '='
      }
    };

    return component;
  }
})();
