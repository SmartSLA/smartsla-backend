(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareFormController', TicketingSoftwareFormController);

  function TicketingSoftwareFormController($q, TicketingSoftwareService) {
    var self = this;

    self.uniqueSoftwareName = uniqueSoftwareName;

    function uniqueSoftwareName(softwareName) {
      if (!softwareName) {
        return $q.reject(new Error('Software name required'));
      }

      return TicketingSoftwareService.getByName(softwareName)
        .then(function(software) {
          if (software && software._id !== self.software._id) {
            return $q.reject(new Error('Software already exists'));
          }
        });
    }
  }
})(angular);
