(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingGlossaryFormController', TicketingGlossaryFormController);

  function TicketingGlossaryFormController(TicketingGlossaryService, $q) {
    var self = this;

    self.save = save;

    function save(form) {
      if (form && form.$valid) {
        self.glossary.category = self.category;

        return TicketingGlossaryService.create(self.glossary)
          .then(function() {
            // Reset form state
            self.glossary = {};
            form.$setPristine();
          });
      }

      return $q.reject(new Error('Form is invalid'));
    }
  }
})(angular);
