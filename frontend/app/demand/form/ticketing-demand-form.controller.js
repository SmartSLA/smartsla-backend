(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingDemandFormController', TicketingDemandFormController);

  function TicketingDemandFormController(
    TicketingGlossaryService,
    TicketingContractService,
    TICKETING_GLOSSARY_CATEGORIES
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      TicketingGlossaryService.list()
        .then(function(glossaries) {
          _getAvailableTypes(glossaries);
        });
    }

    function _getAvailableTypes(glossaries) {
      self.availableDemandTypes = [];
      self.availableSoftwareTypes = [];
      self.availableIssueTypes = [];

      glossaries.forEach(function(glossary) {
        if (glossary.category === TICKETING_GLOSSARY_CATEGORIES.DEMAND_TYPE) {
          self.availableDemandTypes.push(glossary.word);
        } else if (glossary.category === TICKETING_GLOSSARY_CATEGORIES.SOFTWARE_TYPE) {
          self.availableSoftwareTypes.push(glossary.word);
        } else if (glossary.category === TICKETING_GLOSSARY_CATEGORIES.ISSUE_TYPE) {
          self.availableIssueTypes.push(glossary.word);
        }
      });
    }
  }
})(angular);
