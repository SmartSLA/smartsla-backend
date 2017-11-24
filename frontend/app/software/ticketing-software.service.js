(function(angular) {
  angular.module('linagora.esn.ticketing')
    .factory('TicketingSoftwareService', TicketingSoftwareService);

  function TicketingSoftwareService($log, ticketingSoftwareClient) {
    return {
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
  }
})(angular);
