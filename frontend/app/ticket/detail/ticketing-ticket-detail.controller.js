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

      self.onWorkaroundCheckboxChange = onWorkaroundCheckboxChange;
      self.onCorrectionCheckboxChange = onCorrectionCheckboxChange;

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

          self.responseTimer = _calculateTimer('responseTime');
          self.workaroundTimer = _calculateTimer('workaroundTime');
          self.correctionTimer = _calculateTimer('correctionTime');
        });
    }

    function onWorkaroundCheckboxChange(event) {
      event.preventDefault();

      var handleWorkaroundTime = (self.ticket.times && self.ticket.times.workaroundTime !== undefined) ? TicketingTicketService.unsetWorkaroundTime(self.ticketId) : TicketingTicketService.setWorkaroundTime(self.ticketId);

      handleWorkaroundTime
        .then(function(updatedTicket) {
          // update ticket times
          self.ticket.times = updatedTicket.times;
        });
    }

    function onCorrectionCheckboxChange(event) {
      event.preventDefault();

      var handleCorrectionTime = (self.ticket.times && self.ticket.times.correctionTime !== undefined) ? TicketingTicketService.unsetCorrectionTime(self.ticketId) : TicketingTicketService.setCorrectionTime(self.ticketId);

      handleCorrectionTime
        .then(function(updatedTicket) {
          // update ticket times
          self.ticket.times = updatedTicket.times;
        });
    }

    function _calculateTimer(type) {
      if (self.ticket.times && self.ticket.times[type]) {
        return;
      }

      var creationDate = new Date(self.ticket.creation);
      var theoryTime = self.demand[type];
      var passedTime = ((new Date() - creationDate) / 60000); // in minutes

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
