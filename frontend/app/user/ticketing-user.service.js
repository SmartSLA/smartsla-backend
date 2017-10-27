(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingUserService', TicketingUserService);

  function TicketingUserService(
    ticketingUserClient,
    attendeeService
  ) {
    var USER_SEARCH_LIMIT = 20;

    return {
      searchUserCandidates: searchUserCandidates
    };

    function searchUserCandidates(query) {
      return attendeeService.getAttendeeCandidates(query, USER_SEARCH_LIMIT, ['user'])
        .then(function(candidates) {
          return candidates.map(function(candidate) {
            candidate.displayName = candidate.displayName || candidate.email;
            candidate.id = candidate.id || candidate._id;

            return candidate;
          });
        });
    }
  }
})(angular);
