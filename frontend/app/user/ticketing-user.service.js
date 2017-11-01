(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingUserService', TicketingUserService);

  function TicketingUserService(
    $rootScope,
    $q,
    asyncAction,
    ticketingUserClient,
    attendeeService,
    TICKETING_USER_EVENTS
  ) {
    var USER_SEARCH_LIMIT = 20;

    return {
      create: create,
      update: update,
      buildDisplayName: buildDisplayName,
      searchUserCandidates: searchUserCandidates
    };

    function create(user) {
      if (!user) {
        return $q.reject(new Error('User is required'));
      }

      var notificationMessages = {
        progressing: 'Creating user...',
        success: 'User created',
        failure: 'Failed to create user'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingUserClient.create(user);
      }).then(function(response) {
        $rootScope.$broadcast(TICKETING_USER_EVENTS.USER_CREATED, response.data);
      });
    }

    function update(user) {
      if (!user || !user._id) {
        return $q.reject(new Error('User ID is required'));
      }

      var notificationMessages = {
        progressing: 'Updating user...',
        success: 'User updated',
        failure: 'Failed to update user'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingUserClient.update(user._id, user);
      }).then(function() {
        $rootScope.$broadcast(TICKETING_USER_EVENTS.USER_UPDATED, user);
      });
    }

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

    function buildDisplayName(user) {
      return user.firstname + ' ' + user.lastname;
    }
  }
})(angular);
