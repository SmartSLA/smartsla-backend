(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingSearchService', TicketingSearchService);

  function TicketingSearchService($q, _) {
    var DEFAULT_OBJECT_TYPE = 'organization';
    var providers = [];

    return {
      addProvider: addProvider,
      getProviders: getProviders,
      search: search
    };

    function addProvider(provider) {
      if (provider && provider.search) {
        provider.objectType = provider.objectType || DEFAULT_OBJECT_TYPE;
        provider.getDisplayName = provider.getDisplayName || _getDisplayName;

        provider.searchCandidates = function(query, limit) {
          return provider.search(query, limit)
            .then(function(list) {
              return list.map(function(item) {
                return angular.extend(item, {
                  templateUrl: provider.templateUrl,
                  objectType: provider.objectType,
                  displayName: provider.getDisplayName(item)
                });
              });
            });
        };

        providers.push(provider);
      }
    }

    function search(query, limit, objectTypes) {
      objectTypes = objectTypes || [DEFAULT_OBJECT_TYPE];

      var matchingProviders = _.filter(providers, function(provider) {
        return _.contains(objectTypes, provider.objectType);
      });

      return $q.all(matchingProviders.map(function(provider) {
        return provider.searchCandidates(query, limit);
      }))
      .then(function(arrays) {
        return arrays.reduce(function(resultArray, currentArray) {
          return resultArray.concat(currentArray);
        }, []);
      })
      .then(function(array) {
        return array.map(function(item) {
          item._id = item.id; // consistent _id of searched documents with data in mongo

          return item;
        });
      });
    }

    function getProviders() {
      return providers;
    }

    function _getDisplayName(item) {
      return item.id;
    }
  }
})(angular);
