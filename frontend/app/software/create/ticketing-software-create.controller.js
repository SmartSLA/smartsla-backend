(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareCreateController', TicketingSoftwareCreateController);

  function TicketingSoftwareCreateController(_, TicketingSoftwareService) {
    var self = this;

    self.create = create;

    function create() {
      return TicketingSoftwareService.create(_qualifySoftware(self.newSoftware));
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
