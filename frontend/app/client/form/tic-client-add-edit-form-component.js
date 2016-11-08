'use strict';

angular.module('linagora.esn.ticketing')

  .component('ticClientAddEditForm', {
    templateUrl: '/linagora.esn.ticketing/app/client/form/tic-client-add-edit-form.html',
    controller: 'ticClientAddEditFormController',
    controllerAs: 'ctrl',
    bindings: {
      client: '='
    }
  });
