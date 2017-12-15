(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareEditController', TicketingSoftwareEditController);

  function TicketingSoftwareEditController(
    _,
    TicketingSoftwareService,
    software
  ) {
    var self = this;

    self.save = save;
    self.software = software;

    function save() {
      return TicketingSoftwareService.update(_qualifySoftware(self.software));
    }

    function _qualifySoftware(software) {
      var result = angular.copy(software);

      result.versions = _.map(result.versions, function(version) {
        return version.text;
      });

      return result;
    }
  }
})(angular);
