(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareFormController', TicketingSoftwareFormController);

  function TicketingSoftwareFormController($q, ticketingSoftwareClient) {
    var self = this;

    self.uniqueSoftwareName = uniqueSoftwareName;

    function uniqueSoftwareName(softwareName) {
      if (!softwareName) {
        return $q.reject(new Error('Software name required'));
      }

      return ticketingSoftwareClient.getByName(softwareName)
        .then(function(response) {
          var software = response.data;

          if (software && software.length) {
            return $q.reject(new Error('Software already exists'));
          }
        });
    }
  }
})(angular);
