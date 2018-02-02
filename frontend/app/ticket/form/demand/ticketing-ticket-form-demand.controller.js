(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketFormDemandController', TicketingTicketFormDemandController);

  function TicketingTicketFormDemandController($scope, _, esnI18nService) {
    var self = this;
    var NO_SEVERITY_LABEL = esnI18nService.translate('No severity').toString();
    var NO_SOFTWARE_LABEL = esnI18nService.translate('No software').toString();

    self.$onInit = $onInit;

    function $onInit() {
      self.ticket = self.ticket || {};

      if (!self.ticket.contract) {
        $scope.$watch(
          function() { return self.ticket.contract; },
          function(newValue, oldValue) {
            if (newValue !== oldValue) {
              onContractChange();
            }
          }
        );
      } else {
        _initDemandSeveritySoftware();
      }

      self.onDemandTypeChange = onDemandTypeChange;
      self.onServerityChange = onServerityChange;
      self.onSoftwareChange = onSoftwareChange;
    }

    function _initDemandSeveritySoftware() {
      self.availableDemandTypes = _.chain(self.ticket.contract.demands).map('demandType').uniq().value();
      self.availableSeverities = _buildAvailableSeverities(self.ticket);
      self.availableSoftware = _buildAvailableSoftware({
        contract: self.ticket.contract,
        demandType: self.ticket.demandType,
        severity: self.ticket.severity
      });
      // current severity
      self.severity = self.ticket.severity;
      // current software
      if (self.ticket.software) {
        self.software = {
          label: self.ticket.software.template.name + ' - (' + self.ticket.software.criticality + ')'
        };
        self.availableSoftwareVersions = _buildAvailableSoftwareVersions(self.availableSoftware, self.ticket.software.template._id);
      }
    }

    function onContractChange() {
      _resetTicketFields(['demandType', 'severity', 'software']);
      self.software = null;
      self.severity = null;

      if (!self.ticket.contract) {
        self.availableDemandTypes = [];

        return;
      }

      self.availableDemandTypes = _.chain(self.ticket.contract.demands)
                                   .map(function(demand) {
                                     return demand.demandType;
                                   })
                                   .uniq()
                                   .value();
    }

    function onDemandTypeChange() {
      _resetTicketFields(['severity', 'software']);
      self.software = null;
      self.severity = null;

      self.availableSeverities = _buildAvailableSeverities(self.ticket);
      self.availableSoftware = _buildAvailableSoftware({
        contract: self.ticket.contract,
        demandType: self.ticket.demandType
      });
    }

    function onServerityChange() {
      _resetTicketFields(['software']);

      if (self.severity !== NO_SEVERITY_LABEL) {
        self.ticket.severity = self.severity;
      } else {
        _resetTicketFields(['severity']);
      }
      self.software = null;

      self.availableSoftware = _buildAvailableSoftware({
        contract: self.ticket.contract,
        demandType: self.ticket.demandType,
        severity: self.ticket.severity
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

      var availableSeverities = _.chain(ticket.contract.demands)
                                 .filter({ demandType: ticket.demandType })
                                 .map(function(demand) {
                                   return demand.issueType ? demand.issueType : NO_SEVERITY_LABEL;
                                 })
                                 .uniq()
                                 .value();

      // push no severity option at the top of list
      if (availableSeverities.indexOf(NO_SEVERITY_LABEL) > -1) {
        availableSeverities.unshift(NO_SEVERITY_LABEL);
      }

      return _.uniq(availableSeverities);
    }

    function _buildAvailableSoftware(options) {
      if (!options.demandType) {
        return [];
      }

      var availableSoftwareCriticalities = _.chain(options.contract.demands)
                                            .filter({ demandType: options.demandType, issueType: options.severity })
                                            .map(function(demand) {
                                              return demand.softwareType ? demand.softwareType : NO_SOFTWARE_LABEL;
                                            })
                                            .uniq()
                                            .value();

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
          label: NO_SOFTWARE_LABEL
        });
      }

      return availableSoftware;
    }

    function _buildAvailableSoftwareVersions(availableSoftware, softwareId) {
      var software = availableSoftware.filter(function(item) {
        return item.template === softwareId;
      })[0];

      return software && software.versions ? software.versions : [];
    }
  }
})(angular);
