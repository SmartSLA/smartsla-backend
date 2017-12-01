(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSearchAutoCompleteController', TicketingSearchAutoCompleteController);

  function TicketingSearchAutoCompleteController(
    $scope,
    $element,
    $q,
    elementScrollService,
    TicketingSearchService,
    _
  ) {
    var self = this;
    var DEFAULT_SEARCH_LIMIT = 20;
    var DEFAULT_MAX_TAGS = 1000;
    var objectTypes;

    self.$onInit = $onInit;

    function $onInit() {
      self.maxTags = self.maxTags === '' || !self.maxTags ? DEFAULT_MAX_TAGS : self.maxTags; // http://mbenford.github.io/ngTagsInput/documentation/api
      self.minTags = self.minTags === '' || !self.minTags ? 0 : self.minTags;
      self.addFromAutocompleteOnly = self.addFromAutocompleteOnly || true;
      objectTypes = _determineObjectTypes(self.objectTypes);
      self.onTagAdding = onTagAdding;
      self.onTagAdded = onTagAdded;
      self.search = search;
    }

    function search(query) {
      if (self.newTags.length === self.maxTags) {
        return $q.when([]);
      }

      var options = {
        search: query,
        limit: DEFAULT_SEARCH_LIMIT
      };

      if (objectTypes) {
        options.objectTypes = objectTypes;
      }

      if (self.excludedIds) {
        options['excludedIds[]'] = self.excludedIds;
      }

      return TicketingSearchService.search(options);
    }

    function onTagAdding($tag) {
      return (self.newTags.length < self.maxTags) && !_isDuplicatedTag($tag, self.newTags);
    }

    function onTagAdded() {
      elementScrollService.autoScrollDown($element.find('div.tags'));
    }

    function _isDuplicatedTag(tag, tags) {
      return !!_.find(tags, { id: tag.id });
    }

    function _determineObjectTypes(objectTypesStr) {
      if (!objectTypesStr) {
        return;
      }

      var objectTypes = [];

      angular.forEach(objectTypesStr.split(','), function(objectType) {
        objectType = objectType.trim();

        if (objectType) {
          objectTypes.push(objectType);
        }
      });

      return objectTypes;
    }
  }
})(angular);
