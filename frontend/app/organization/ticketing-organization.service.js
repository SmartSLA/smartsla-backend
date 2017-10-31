(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingOrganizationService', TicketingOrganizationService);

  function TicketingOrganizationService(
    $rootScope,
    $q,
    ticketingOrganizationClient,
    TicketingUserService,
    asyncAction,
    TICKETING_ORGANIZATION_EVENTS
  ) {
    return {
      create: create,
      get: get,
      update: update
    };

    function get(organizationId) {
      return ticketingOrganizationClient.get(organizationId)
        .then(function(response) {
          var organization = response.data;

          organization.manager = _denormalizeManager(organization.manager);

          return organization;
        });
    }

    function create(organization) {
      if (!organization) {
        return $q.reject(new Error('Organization is required'));
      }

      var manager = angular.copy(organization.manager);

      organization.manager = organization.manager && organization.manager._id ? organization.manager._id : organization.manager;

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

      organizationToUpdate.manager = organizationToUpdate.manager && organizationToUpdate.manager._id ? organizationToUpdate.manager._id : organizationToUpdate.manager;

      var notificationMessages = {
        progressing: 'Updating organization...',
        success: 'Organization updated',
        failure: 'Failed to update organization'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingOrganizationClient.update(organizationToUpdate._id, organizationToUpdate);
      });
    }

    function _denormalizeManager(manager) {
      manager.displayName = manager ? TicketingUserService.buildDisplayName(manager) : manager.email;
      manager.id = manager._id;

      return manager;
    }
  }
})(angular);
