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
    var TICKET_STATES = {
      NEW: 'New',
      IN_PROGRESS: 'In progress',
      AWAITING: 'Awaiting',
      AWAITING_INFORMATION: 'Awaiting information',
      AWAITING_VALIDATION: 'Awaiting validation',
      CLOSED: 'Closed',
      ABANDONED: 'Abandoned'
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.ticketId = $stateParams.ticketId;

      self.availableStates = Object.keys(TICKET_STATES).map(function(key) {
        return TICKET_STATES[key];
      });

      self.onStateChange = onStateChange;
      self.isSuspendedState = isSuspendedState;
      self.onWorkaroundCheckboxChange = onWorkaroundCheckboxChange;
      self.onCorrectionCheckboxChange = onCorrectionCheckboxChange;

      TicketingTicketService.get(self.ticketId)
        .then(function(ticket) {
          self.ticket = ticket;
          self.state = self.ticket.state;

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

    function onStateChange() {
      TicketingTicketService.updateState(self.ticketId, self.state)
        .then(function() {
          self.ticket.state = self.state;
        })
        .catch(function() {
          // failed, keep state
          self.state = self.ticket.state;
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

    function isSuspendedState(state) {
      return [TICKET_STATES.AWAITING,
              TICKET_STATES.AWAITING_INFORMATION,
              TICKET_STATES.AWAITING_VALIDATION,
              TICKET_STATES.CLOSED].indexOf(state) > -1;
    }

    function _calculateTimer(type) {
      if (self.ticket.times && self.ticket.times[type]) {
        return;
      }

      var creationDate = new Date(self.ticket.creation);
      var theoryTime = self.demand[type];
      var passedTime = ((new Date() - creationDate) / 60000); // in minutes

      if (isSuspendedState(self.ticket.state)) { // have to minus duration between now and last suspended moment
        passedTime -= (new Date() - new Date(self.ticket.times.suspendedAt)) / 60000;
      }
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
