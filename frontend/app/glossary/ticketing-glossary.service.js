(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('TicketingGlossaryService', TicketingGlossaryService);

  function TicketingGlossaryService(
    $rootScope,
    asyncAction,
    TicketingGlossaryClient,
    TICKETING_GLOSSARY_EVENTS,
    TICKETING_GLOSSARY_CATEGORIES
  ) {
    var demandTypeNotificationMessages = {
      progressing: 'Adding demand type...',
      success: 'Demand type added',
      failure: 'Failed to add demand type'
    };
    var softwareTypeNotificationMessages = {
      progressing: 'Adding software type...',
      success: 'Software type added',
      failure: 'Failed to add software type'
    };
    var issueTypeNotificationMessages = {
      progressing: 'Adding issue type...',
      success: 'Issue type added',
      failure: 'Failed to add issue type'
    };

    return {
      create: create,
      list: list
    };

    function create(glossary) {
      if (!glossary) {
        return $q.reject(new Error('glossary is required'));
      }

      return asyncAction(_buildCreationNotificationMessage(glossary.category), function() {
        return TicketingGlossaryClient.create(glossary);
      }).then(function(response) {
        $rootScope.$broadcast(TICKETING_GLOSSARY_EVENTS.CREATED, response.data);
      });
    }

    function list(options) {
      return TicketingGlossaryClient.list(options)
        .then(function(response) {
          return response.data;
        });
    }

    function _buildCreationNotificationMessage(category) {
      var message = {};

      switch (category) {
        case TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE:
          message = demandTypeNotificationMessages;
          break;
        case TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE:
          message = softwareTypeNotificationMessages;
          break;
        case TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE:
          message = issueTypeNotificationMessages;
      }

      return message;
    }
  }
})(angular);
