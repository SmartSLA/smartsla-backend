(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSearchAutoCompleteController', TicketingSearchAutoCompleteController);

  function TicketingSearchAutoCompleteController(
    $element,
    elementScrollService,
    TicketingSearchService,
    _
  ) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.maxTags = self.maxTags === '' || !self.maxTags ? 'MAX_SAFE_INTEGER' : self.maxTags; // http://mbenford.github.io/ngTagsInput/documentation/api
      self.addFromAutocompleteOnly = self.addFromAutocompleteOnly || true;
      self.onTagAdding = onTagAdding;
      self.onTagAdded = onTagAdded;
      self.search = TicketingSearchService.search;
    }

    function onTagAdding($tag) {
      return !_isDuplicatedTag($tag, self.newTags);
    }

    function onTagAdded() {
      elementScrollService.autoScrollDown($element.find('div.tags'));
    }

    function _isDuplicatedTag(tag, tags) {
      return !!_.find(tags, { id: tag.id });
    }
  }
})(angular);
