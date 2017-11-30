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

        provider.searchCandidates = function(options) {
          return provider.search(options)
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

    /**
     * Search candidates
     * @param  {Object} options The options object contains:
     *                          - search: for filtering terms
     *                          - limit: limit the number of candidates
     *                          - objectTypes (optional): The candidate types which be searched
     *                          - excludedIds (optional): The list of excluded ids
     * @return {Promise} resolve on success with an array of candidates
     */
    function search(options) {
      options.objectTypes = options.objectTypes || [DEFAULT_OBJECT_TYPE];
      var matchingProviders = _.filter(providers, function(provider) {
        return _.contains(options.objectTypes, provider.objectType);
      });

      delete options.objectTypes;

      return $q.all(matchingProviders.map(function(provider) {
        return provider.searchCandidates(options);
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
