(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingGlossaryFormController', TicketingGlossaryFormController);

  function TicketingGlossaryFormController($q, _, TicketingGlossaryService) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.glossary = {
        category: self.group.category
      };

      self.onAddBtnClick = onAddBtnClick;
      self.uniqueWord = uniqueWord;
    }

    function onAddBtnClick(form) {
      if (form && form.$valid) {
        return TicketingGlossaryService.create(self.glossary)
          .then(function() {
            // Reset form state
            self.glossary = {
              category: self.group.category
            };
            form.$setPristine();
            form.$setUntouched();
          });
      }

      return $q.reject(new Error('Form is invalid'));
    }

    function uniqueWord(word) {
      if (!word) {
        return false;
      }

      return !_.find(self.group.glossaries, { word: word });
    }
  }
})(angular);
