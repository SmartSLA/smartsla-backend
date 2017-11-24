(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareCreateController', TicketingSoftwareCreateController);

  function TicketingSoftwareCreateController(TicketingSoftwareService, _) {
    var self = this;

    self.create = create;

    function create() {
      self.newSoftware = _qualifySoftware(self.newSoftware);

      return TicketingSoftwareService.create(self.newSoftware);
    }

    function _qualifySoftware(software) {
      software.versions = _.map(software.versions, function(version) {
        return version.text;
      });

      return software;
    }
  }
})(angular);
