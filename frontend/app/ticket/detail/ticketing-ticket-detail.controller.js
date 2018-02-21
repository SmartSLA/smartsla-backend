(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketDetailController', TicketingTicketDetailController);

  function TicketingTicketDetailController(
    $stateParams,
    $filter,
    _,
    esnI18nService,
    TicketingTicketService,
    TICKETING_TICKET_STATES
  ) {
    var self = this;

    var originTicket;

    self.$onInit = $onInit;

    function $onInit() {
      self.ticketId = $stateParams.ticketId;

      self.availableStates = Object.keys(TICKETING_TICKET_STATES).map(function(key) {
        return TICKETING_TICKET_STATES[key].value;
      });

      self.onStateChange = onStateChange;
      self.isSuspendedState = isSuspendedState;
      self.onWorkaroundCheckboxChange = onWorkaroundCheckboxChange;
      self.onCorrectionCheckboxChange = onCorrectionCheckboxChange;

      self.onCancelBtnClick = onCancelBtnClick;
      self.onSaveBtnClick = onSaveBtnClick;

      TicketingTicketService.get(self.ticketId)
        .then(function(ticket) {
          self.ticket = ticket;
          originTicket = angular.copy(self.ticket);
          self.state = self.ticket.state;

          self.demand = _.find(self.ticket.contract.demands, {
            demandType: self.ticket.demandType,
            issueType: self.ticket.severity,
            softwareType: self.ticket.software ? self.ticket.software.criticality : undefined
          });

          self.supportTechnicianDisplayNames = _buildSupportTechnicianDisplayNames(self.ticket.supportTechnicians);

          self.responseTimer = _calculateTimer('response');
          self.workaroundTimer = _calculateTimer('workaround');
          self.correctionTimer = _calculateTimer('correction');

          _setupUserAutocompleteForms();
        });
    }

    function onStateChange() {
      TicketingTicketService.updateState(self.ticketId, self.state)
        .then(function(updatedTicket) {
          self.ticket.state = updatedTicket.state;
          self.ticket.times = updatedTicket.times;
        })
        .catch(function() {
          // failed, keep state
          self.state = self.ticket.state;
        });
    }

    function onWorkaroundCheckboxChange(event) {
      event.preventDefault();

      var handleWorkaroundTime = (self.ticket.times && self.ticket.times.workaround !== undefined) ? TicketingTicketService.unsetWorkaroundTime(self.ticketId) : TicketingTicketService.setWorkaroundTime(self.ticketId);

      handleWorkaroundTime
        .then(function(updatedTicket) {
          // update ticket times
          self.ticket.times = updatedTicket.times;
        });
    }

    function onCorrectionCheckboxChange(event) {
      event.preventDefault();

      var handleCorrectionTime = (self.ticket.times && self.ticket.times.correction !== undefined) ? TicketingTicketService.unsetCorrectionTime(self.ticketId) : TicketingTicketService.setCorrectionTime(self.ticketId);

      handleCorrectionTime
        .then(function(updatedTicket) {
          // update ticket times
          self.ticket.times = updatedTicket.times;
        });
    }

    function onCancelBtnClick() {
      if (self.isEditMode) {
        self.isEditMode = false;
        self.ticket = angular.copy(originTicket);
        _setupUserAutocompleteForms();
      }
    }

    function onSaveBtnClick() {
      return TicketingTicketService.update(self.ticket)
        .then(function() {
          self.isEditMode = false;
          // need populated software template for software name
          self.ticket.software.template = self.ticket.software.template._id ? self.ticket.software.template :
            _.find(self.ticket.contract.software, function(item) {
              return item.template._id === self.ticket.software.template;
            }).template;
          // update originTicket
          originTicket = angular.copy(self.ticket);

          self.supportTechnicianDisplayNames = _buildSupportTechnicianDisplayNames(self.ticket.supportTechnicians);
        });
    }

    function isSuspendedState(state) {
      return [TICKETING_TICKET_STATES.AWAITING.value,
              TICKETING_TICKET_STATES.AWAITING_INFORMATION.value,
              TICKETING_TICKET_STATES.AWAITING_VALIDATION.value,
              TICKETING_TICKET_STATES.CLOSED.value].indexOf(state) > -1;
    }

    function _buildSupportTechnicianDisplayNames(supportTechnicians) {
      return supportTechnicians.map(function(supportTechnician) {
        return supportTechnician.displayName;
      });
    }

    function _calculateTimer(type) {
      if (self.ticket.times && self.ticket.times[type]) {
        return;
      }

      var creationDate = new Date(self.ticket.creation);
      var theoryTime = self.demand[type + 'Time'];
      var passedTime = ((new Date() - creationDate) / 60000); // in minutes

      if (isSuspendedState(self.ticket.state)) { // have to minus duration between now and last suspended moment
        passedTime -= (new Date() - new Date(self.ticket.times.suspendedAt)) / 60000;
      }
      if (type !== 'response' && self.ticket.times && self.ticket.times.suspend) {
        passedTime -= self.ticket.times.suspend;
      }

      return {
        countdown: theoryTime,
        passed: passedTime,
        interval: 60000 // 1 minute
      };
    }

    function _setupUserAutocompleteForms() {
      self.requesters = self.ticket.requester ? [self.ticket.requester] : [];
      self.supportManagers = self.ticket.supportManager ? [self.ticket.supportManager] : [];
      self.supportTechnicians = self.ticket.supportTechnicians ? self.ticket.supportTechnicians : [];
    }
  }
})(angular);
