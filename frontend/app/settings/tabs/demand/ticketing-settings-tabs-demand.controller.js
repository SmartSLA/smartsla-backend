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
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.demandType = {
        category: TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE,
        listTitle: 'List of demand types',
        emptyMessage: 'No demand type'
      };
      self.softwareType = {
        category: TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE,
        listTitle: 'List of software types',
        emptyMessage: 'No software type'
      };
      self.issueType = {
        category: TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE,
        listTitle: 'List of issue types',
        emptyMessage: 'No issue type'
      };

      TicketingGlossaryService.list()
        .then(function(glossaries) {
          self.demandType.glossaries = _buildGroupGlossaries(TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE, glossaries);
          self.softwareType.glossaries = _buildGroupGlossaries(TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE, glossaries);
          self.issueType.glossaries = _buildGroupGlossaries(TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE, glossaries);
        });

      $scope.$on(TICKETING_GLOSSARY_EVENTS.CREATED, function(event, glossary) {
        _onGlossaryCreated(glossary);
      });
    }

    function _buildGroupGlossaries(category, glossaries) {
      return glossaries.filter(function(glossary) {
        return glossary.category === category;
      });
    }

    function _onGlossaryCreated(glossary) {
      switch (glossary.category) {
        case TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE:
          self.demandType.glossaries.unshift(glossary);
          break;
        case TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE:
          self.softwareType.glossaries.unshift(glossary);
          break;
        case TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE:
          self.issueType.glossaries.unshift(glossary);
      }
    }
  }
})(angular);
