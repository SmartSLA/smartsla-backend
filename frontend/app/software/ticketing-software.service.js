(function(angular) {
  angular.module('linagora.esn.ticketing')
    .factory('TicketingSoftwareService', TicketingSoftwareService);

  function TicketingSoftwareService(
    $rootScope,
    $log,
    asyncAction,
    ticketingSoftwareClient,
    TICKETING_SOFTWARE_EVENTS
  ) {
    return {
      create: create,
      getSearchProvider: getSearchProvider,
      list: list
    };

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
        search: function(query, limit) {
          var searchQuery = {
            search: query,
            limit: limit
          };

          return ticketingSoftwareClient.list(searchQuery)
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
  }
})(angular);
