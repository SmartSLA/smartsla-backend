(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrderCreateController', TicketingOrderCreateController);

  function TicketingOrderCreateController(TicketingOrderService, contract) {
    var self = this;

    self.order = {};
    if (contract) {
      self.order.contract = contract;
    }

    self.create = create;

    function create() {
      self.order.contract = self.order.contract && self.order.contract._id ? self.order.contract._id : self.order.contract;

      return TicketingOrderService.create(self.order);
    }
  }
})(angular);
