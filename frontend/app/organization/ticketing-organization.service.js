(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingOrganizationService', TicketingOrganizationService);

  function TicketingOrganizationService(
    $rootScope,
    $q,
    ticketingOrganizationClient,
    asyncAction,
    TICKETING_ORGANIZATION_EVENTS
  ) {
    return {
      create: create,
      update: update
    };

    function create(organization, administrator) {
      if (!organization) {
        return $q.reject(new Error('Organization is required'));
      }

      if (administrator) {
        organization.administrator = administrator._id;
      }

      var notificationMessages = {
        progressing: 'Creating organization...',
        success: 'Organization created',
        failure: 'Failed to create organization'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingOrganizationClient.create(organization);
      }).then(function(response) {
        var createdOrganization = response.data;

        createdOrganization.administrator = administrator;

        $rootScope.$broadcast(TICKETING_ORGANIZATION_EVENTS.ORGANIZATION_CREATED, createdOrganization);
      });
    }

    function update(organization) {
      if (!organization) {
        return $q.reject(new Error('Organization is required'));
      }

      var notificationMessages = {
        progressing: 'Updating organization...',
        success: 'Organization updated',
        failure: 'Failed to update organization'
      };

      return asyncAction(notificationMessages, function() {
        return ticketingOrganizationClient.update(organization._id, organization);
      });
    }
  }
})(angular);
