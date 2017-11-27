(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserCreateController', TicketingUserCreateController);

  function TicketingUserCreateController(TicketingUserService, entity) {
    var self = this;

    self.user = {};
    if (entity) {
      self.user.entity = entity;
    }

    self.create = create;

    function create() {
      return TicketingUserService.create(self.user);
    }
  }
})(angular);
