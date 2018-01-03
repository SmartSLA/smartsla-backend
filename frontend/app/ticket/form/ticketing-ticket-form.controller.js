(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketFormController', TicketingTicketFormController);

  function TicketingTicketFormController(_) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.onContractChange = onContractChange;
      self.onDemandTypeChange = onDemandTypeChange;
      self.onServerityChange = onServerityChange;
      self.onSoftwareChange = onSoftwareChange;
    }

    function onContractChange() {
      _resetTicketFields(['demandType', 'severity', 'software']);
      self.software = null;
      self.ticket.contract = self.contracts && self.contracts.length ? self.contracts[0] : null;

      if (!self.ticket.contract) {
        self.availableDemandTypes = [];

        return;
      }

      self.availableDemandTypes = _.map(self.ticket.contract.demands, function(demand) {
        return demand.demandType;
      });

      // unique the array of available types
      self.availableDemandTypes = self.availableDemandTypes.filter(function(value, index) {
        return self.availableDemandTypes.indexOf(value) === index;
      }).filter(Boolean);
    }

    function onDemandTypeChange() {
      _resetTicketFields(['severity', 'software']);
      self.software = null;
      if (!self.ticket.demandType) {
        self.availableSeverities = [];

        return;
      }

      self.availableSeverities = _.map(self.ticket.contract.demands, function(demand) {
        if (demand.demandType === self.ticket.demandType) {
          return demand.issueType;
        }
      });

      // unique the array of available types
      self.availableSeverities = self.availableSeverities.filter(function(value, index) {
        return self.availableSeverities.indexOf(value) === index;
      }).filter(Boolean);
    }

    function onServerityChange() {
      _resetTicketFields(['software']);
      self.software = null;
      if (!self.ticket.demandType || !self.ticket.severity) {
        self.availableSoftware = [];

        return;
      }

      var availableSoftwareCriticality = _.map(self.ticket.contract.demands, function(demand) {
        if (demand.demandType === self.ticket.demandType && demand.issueType === self.ticket.severity) {
          return demand.softwareType;
        }
      }).filter(Boolean);

      self.availableSoftware = _.map(self.ticket.contract.software, function(item) {
        if (availableSoftwareCriticality.indexOf(item.type) > -1) {
          return {
            template: item.template._id,
            type: item.type,
            versions: item.versions,
            label: item.template.name + ' - (' + item.type + ')'
          };
        }
      }).filter(Boolean);
    }

    function onSoftwareChange() {
      self.ticket.software = {
        template: self.software.template,
        criticality: self.software.type
      };

      self.availableSoftwareVersions = self.software.versions;
    }

    function _resetTicketFields(fields) {
      if (!fields || !fields.length) return;

      self.ticket = self.ticket || {};

      angular.forEach(fields, function(key) {
        delete self.ticket[key];
      });
    }
  }
})(angular);
