(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketDetailController', TicketingTicketDetailController);

  function TicketingTicketDetailController(
    $stateParams,
    $filter,
    _,
    esnI18nService,
    TicketingTicketService
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.ticketId = $stateParams.ticketId;

      TicketingTicketService.get(self.ticketId)
        .then(function(ticket) {
          self.ticket = ticket;

          self.demand = _.find(self.ticket.contract.demands, {
            demandType: self.ticket.demandType,
            issueType: self.ticket.severity,
            softwareType: self.ticket.software ? self.ticket.software.criticality : undefined
          });

          self.supportTechnicians = _.map(self.ticket.supportTechnicians, function(supportTechnician) {
            return supportTechnician.displayName;
          });

          self.responseTimer = _caculatorTimer('responseTime');
          self.workaroundTimer = _caculatorTimer('workaroundTime');
          self.correctionTimer = _caculatorTimer('correctionTime');
        });
    }

    function _caculatorTimer(type) {
      if (self.ticket.times && self.ticket.times[type]) {
        return;
      }

      var creattionDate = new Date(self.ticket.creation);
      var theoryTime = self.demand[type];
      var passedTime = ((new Date() - creattionDate) / 60000); //in minutes

      if (type !== 'responseTime' && self.ticket.times && self.ticket.times.suspendTime) {
        passedTime -= self.ticket.times.suspendTime;
      }

      return {
        countdown: theoryTime,
        passed: passedTime,
        interval: 60000 // 1 minute
      };
    }
  }
})(angular);
