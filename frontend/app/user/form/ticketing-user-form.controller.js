(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserFormController', TicketingUserFormController);

  function TicketingUserFormController($scope, TicketingService) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.entity = self.user.entity;
      TicketingService.handleAutoCompleteWithOneTag($scope, self.user, {
        newEntities: 'entity'
      });
    }
  }
})(angular);
