(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingUserService', TicketingUserService);

  function TicketingUserService(
    $rootScope,
    $q,
    $log,
    asyncAction,
    ticketingUserClient,
    domainAPI,
    TICKETING_USER_EVENTS
  ) {

    return {
      create: create,
      get: get,
      update: update,
      buildDisplayName: buildDisplayName,
      getSearchProvider: getSearchProvider
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

    function get(userId) {
      return ticketingUserClient.get(userId)
        .then(function(response) {
          return response.data;
        });
    }

    function getSearchProvider(domainId) {
      return {
        objectType: 'user',
        templateUrl: '/views/modules/auto-complete/user-auto-complete',
        getDisplayName: function(user) {
          return (user.firstname && user.lastname) ? user.firstname + ' ' + user.lastname : user.preferredEmail;
        },
        search: function(options) {
          return domainAPI.getMembers(domainId, options)
            .then(function(response) {
              return response.data;
            }, function(err) {
              $log.error('Error while searching users:', err);

              return $q.when([]);
            });
        }
      };
    }

    function buildDisplayName(user) {
      return user.firstname + ' ' + user.lastname;
    }
  }
})(angular);
