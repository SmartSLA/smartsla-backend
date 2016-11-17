'use strict';

angular.module('linagora.esn.ticketing')

  .component('ticClientForm', {
    templateUrl: '/linagora.esn.ticketing/app/client/form/tic-client-form.html',
    controller: 'ticClientFormController',
    controllerAs: 'ctrl',
    bindings: {
      client: '=',
      formName: '@?',
      form: '=?'
    }
  });
