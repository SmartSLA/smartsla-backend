(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketFormController', TicketingTicketFormController);

  function TicketingTicketFormController(_, esnI18nService) {
    var self = this;
    var NO_SEVERITY_LABEL = 'No severity';
    var NO_SOFTWARE_LABEL = 'No software';

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
      self.availableDemandTypes = _.uniq(self.availableDemandTypes);
    }

    function onDemandTypeChange() {
      _resetTicketFields(['severity', 'software']);

      self.software = null;
      self.availableSeverities = _buildAvailableSeverities(self.ticket);
      self.availableSoftware = _buildAvailableSoftware({
        contract: self.ticket.contract,
        demandType: self.ticket.demandType
      });
    }

    function onServerityChange() {
      _resetTicketFields(['software']);
      if (!self.severity || self.severity === NO_SEVERITY_LABEL) {
        _resetTicketFields(['severity']);
      } else {
        self.ticket.severity = self.severity;
      }

      self.software = null;
      self.availableSoftware = _buildAvailableSoftware({
        contract: self.ticket.contract,
        demandType: self.ticket.demandType,
        severity: self.severity
      });
    }

    function onSoftwareChange() {
      if (self.software && self.software.template) {
        self.ticket.software = {
          template: self.software.template,
          criticality: self.software.type
        };
      } else {
        _resetTicketFields(['software']);
      }

      self.availableSoftwareVersions = self.software.versions;
    }

    function _resetTicketFields(fields) {
      if (!fields || !fields.length) return;

      self.ticket = self.ticket || {};

      angular.forEach(fields, function(key) {
        delete self.ticket[key];
      });
    }

    function _buildAvailableSeverities(ticket) {
      if (!ticket.demandType) {
        return [];
      }

      var availableSeverities = _.map(ticket.contract.demands, function(demand) {
        if (demand.demandType === ticket.demandType) {
          return demand.issueType ? demand.issueType : esnI18nService.translate(NO_SEVERITY_LABEL).toString();
        }
      }).filter(Boolean);

      if (availableSeverities.indexOf(NO_SEVERITY_LABEL) !== -1) {
        availableSeverities.unshift(NO_SEVERITY_LABEL); //push no severity option at the top of list
      }

      // unique the array of available severities
     return _.uniq(availableSeverities);
    }

    function _buildAvailableSoftware(options) {
      if (!options.demandType) {
        return [];
      }

      var availableSoftwareCriticalities;

      if (options.severity && options.severity !== NO_SEVERITY_LABEL) {
        availableSoftwareCriticalities = _.map(options.contract.demands, function(demand) {
          if (demand.demandType === options.demandType && demand.issueType === options.severity) {
            return demand.softwareType ? demand.softwareType : NO_SOFTWARE_LABEL;
          }
        });
      } else {
        availableSoftwareCriticalities = _.map(options.contract.demands, function(demand) {
          if (!demand.issueType && demand.demandType === options.demandType) {
            return demand.softwareType ? demand.softwareType : NO_SOFTWARE_LABEL;
          }
        });

        // unique the array of available software criticalities
        availableSoftwareCriticalities = _.uniq(availableSoftwareCriticalities);
      }

      var availableSoftware = _.map(options.contract.software, function(item) {
        if (availableSoftwareCriticalities.indexOf(item.type) > -1) {
          return {
            template: item.template._id,
            type: item.type,
            versions: item.versions,
            label: item.template.name + ' - (' + item.type + ')'
          };
        }
      }).filter(Boolean);

      if (availableSoftwareCriticalities.indexOf(NO_SOFTWARE_LABEL) > -1) {
        availableSoftware.unshift({
          label: esnI18nService.translate(NO_SOFTWARE_LABEL).toString()
        });
      }

      return availableSoftware;
    }
  }
})(angular);
