(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSettingsTabsDemandController', TicketingSettingsTabsDemandController);

  function TicketingSettingsTabsDemandController(
    $scope,
    TicketingGlossaryService,
    TICKETING_GLOSSARY_EVENTS,
    TICKETING_GLOSSARY_CATEGORIES
  ) {
    var demandType = {
      category: TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE,
      listTitle: 'List of demand types',
      emptyMessage: 'No demand type'
    };
    var softwareType = {
      category: TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE,
      listTitle: 'List of software types',
      emptyMessage: 'No software type'
    };
    var issueType = {
      category: TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE,
      listTitle: 'List of issue types',
      emptyMessage: 'No issue type'
    };
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.glossaries = [demandType, softwareType, issueType];

      TicketingGlossaryService.list()
        .then(function(glossaries) {
          demandType.group = _buildGlossaryGroup(glossaries, TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE);
          softwareType.group = _buildGlossaryGroup(glossaries, TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE);
          issueType.group = _buildGlossaryGroup(glossaries, TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE);
        });

      $scope.$on(TICKETING_GLOSSARY_EVENTS.CREATED, function(event, glossary) {
        _onGlossaryCreated(glossary);
      });
    }

    function _buildGlossaryGroup(glossaries, category) {
      return glossaries.filter(function(glossary) {
        return glossary.category === category;
      });
    }

    function _onGlossaryCreated(glossary) {
      switch (glossary.category) {
        case TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE:
          demandType.group.unshift(glossary);
          break;
        case TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE:
          softwareType.group.unshift(glossary);
          break;
        case TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE:
          issueType.group.unshift(glossary);
      }
    }
  }
})(angular);
