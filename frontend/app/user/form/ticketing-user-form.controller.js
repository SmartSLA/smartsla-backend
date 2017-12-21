(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserFormController', TicketingUserFormController);

  function TicketingUserFormController() {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.entity = self.user.entity;
      self.onEntityChange = onEntityChange;
    }

    function onEntityChange() {
      self.user.entity = self.entities.length ? self.entities[0] : null;
    }
  }
})(angular);
