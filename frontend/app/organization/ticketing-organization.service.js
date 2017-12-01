(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingOrganizationService', TicketingOrganizationService);

  function TicketingOrganizationService(
    $rootScope,
    $q,
    $log,
    ticketingOrganizationClient,
    TicketingUserService,
    TicketingService,
    asyncAction,
    TICKETING_ORGANIZATION_EVENTS
  ) {
    return {
      create: create,
      get: get,
      getEntitySearchProvider: getEntitySearchProvider,
      getOrganizationSearchProvider: getOrganizationSearchProvider,
      update: update
    };

    function get(organizationId) {
      return ticketingOrganizationClient.get(organizationId)
        .then(function(response) {
          var organization = response.data;

          if (organization.manager) {
            organization.manager = _denormalizeManager(organization.manager);
          }

          return organization;
        });
    }

    function create(organization) {
      if (!organization) {
        return $q.reject(new Error('Organization is required'));
      }

      var manager = angular.copy(organization.manager);

      TicketingService.depopulate(organization, ['manager']);

      var notificationMessages = {
        progressing: 'Creating organization...',
        success: 'Organization created',
        failure: 'Failed to create organization'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingOrganizationClient.create(organization);
      }).then(function(response) {
        var createdOrganization = response.data;

        createdOrganization.manager = manager;

        $rootScope.$broadcast(TICKETING_ORGANIZATION_EVENTS.ORGANIZATION_CREATED, createdOrganization);
      });
    }

    function update(organization) {
      if (!organization) {
        return $q.reject(new Error('Organization is required'));
      }

      var organizationToUpdate = angular.copy(organization);

      TicketingService.depopulate(organizationToUpdate, ['manager']);

      var notificationMessages = {
        progressing: 'Updating organization...',
        success: 'Organization updated',
        failure: 'Failed to update organization'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingOrganizationClient.update(organizationToUpdate._id, organizationToUpdate);
      });
    }

    function getOrganizationSearchProvider() {
      return {
        objectType: 'organization',
        templateUrl: '/ticketing/app/organization/search-template/ticketing-organization-search-template.html',
        getDisplayName: function(organization) {
          return organization.shortName;
        },
        search: function(options) {
          return ticketingOrganizationClient.list(options)
            .then(function(response) {
              return response.data;
            }, function(err) {
              $log.error('Error while searching organization:', err);

              return $q.when([]);
            });
        }
      };
    }

    function getEntitySearchProvider() {
      return {
        objectType: 'entity',
        templateUrl: '/ticketing/app/organization/search-template/ticketing-organization-search-template.html',
        getDisplayName: function(entity) {
          return entity.shortName;
        },
        search: function(options) {
          options.parent = true;

          return ticketingOrganizationClient.list(options)
            .then(function(response) {
              return response.data;
            }, function(err) {
              $log.error('Error while searching entities:', err);

              return $q.when([]);
            });
        }
      };
    }

    function _denormalizeManager(manager) {
      manager.displayName = TicketingUserService.buildDisplayName(manager) || manager.preferredEmail;
      manager.id = manager._id;

      return manager;
    }
  }
})(angular);
