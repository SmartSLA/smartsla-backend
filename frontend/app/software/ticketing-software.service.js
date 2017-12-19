(function(angular) {
  angular.module('linagora.esn.ticketing')
    .factory('TicketingSoftwareService', TicketingSoftwareService);

  function TicketingSoftwareService(
    $rootScope,
    $log,
    $q,
    asyncAction,
    ticketingSoftwareClient,
    TICKETING_SOFTWARE_EVENTS
  ) {
    return {
      create: create,
      getByName: getByName,
      getSearchProvider: getSearchProvider,
      list: list,
      update: update
    };

    function getByName(softwareName) {
      return ticketingSoftwareClient.getByName(softwareName)
        .then(function(response) {
          return response.data && response.data[0];
        });
    }

    function list(options) {
      return ticketingSoftwareClient.list(options)
        .then(function(response) {
          return response.data;
        });
    }

    function getSearchProvider() {
      return {
        objectType: 'software',
        templateUrl: '/ticketing/app/software/search-template/ticketing-software-search-template.html',
        getDisplayName: function(software) {
          return software.name;
        },
        search: function(options) {
          return ticketingSoftwareClient.list(options)
            .then(function(response) {
              return response.data;
            }, function(err) {
              $log.error('Error while searching software:', err);

              return $q.when([]);
            });
        }
      };
    }

    function create(software) {
      if (!software) {
        return $q.reject(new Error('Software is required'));
      }

      var notificationMessages = {
        progressing: 'Creating software...',
        success: 'Software created',
        failure: 'Failed to create software'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingSoftwareClient.create(software);
      }).then(function(response) {
        $rootScope.$broadcast(TICKETING_SOFTWARE_EVENTS.CREATED, response.data);
      });
    }

    function update(software) {
      if (!software) {
        return $q.reject(new Error('Software is required'));
      }

      if (!software._id) {
        return $q.reject(new Error('Software ID is required'));
      }

      var notificationMessages = {
        progressing: 'Updating software...',
        success: 'Software updated',
        failure: 'Failed to update software'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingSoftwareClient.update(software._id, software);
      }).then(function() {
        $rootScope.$broadcast(TICKETING_SOFTWARE_EVENTS.UPDATED, software);
      });
    }
  }
})(angular);
