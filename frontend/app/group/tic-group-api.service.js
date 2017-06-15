(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticGroupApiService', ticGroupApiService);

  function ticGroupApiService($q, ticRestangular) {
    return {
      getClientGroups: getClientGroups,
      createGroup: createGroup,
      createGroups: createGroups,
      deleteGroup: deleteGroup
    };

    ////////////

    function getClientGroups(groupIds) {
      var option = {
        option: {
          _id: {
            $in: groupIds && groupIds.length ? groupIds : []
          }
        }
      };

      return ticRestangular.all('groups').customGETLIST('', option);
    }

    function createGroup(group) {
      return ticRestangular.all('groups').post(group);
    }

    function createGroups(client) {
      var groupIds = [];

      return $q.all(client.groups.map(function(group) {
        if (!group._id) {
          return createGroup(group);
        }

        return group;
      }))
      .then(function(results) {
        results.map(function(_group) {
          _group.data ? groupIds.push(_group.data._id) : groupIds.push(_group._id);
        });
        client.groups = groupIds;

        return client;
      });
    }

    function deleteGroup(groupId) {
      return ticRestangular.all('groups').one(groupId).remove();
    }
  }
})();
