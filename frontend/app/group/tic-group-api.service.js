(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticGroupApiService', ticGroupApiService);

  function ticGroupApiService(ticRestangular) {
    return {
      getClientGroups: getClientGroups,
      createGroup: createGroup
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
  }
})();
