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
    var maxTags, objectTypes;
    var options;

    self.$onInit = $onInit;
    self.search = search;

    function $onInit() {
      self.newTags = self.newTags || [];
      maxTags = self.maxTags ? self.maxTags : DEFAULT_MAX_TAGS; // http://mbenford.github.io/ngTagsInput/documentation/api
      self.addFromAutocompleteOnly = self.addFromAutocompleteOnly || true;
      objectTypes = _determineObjectTypes(self.objectTypes);

      self.onTagAdding = onTagAdding;
      self.onTagAdded = onTagAdded;
      self.search = search;

      options = _denormalizeOptions(self.options);
    }

    function search(query) {
      if (self.newTags.length === maxTags) {
        return $q.when([]);
      }

      options.search = query;

      if (objectTypes) {
        options.objectTypes = objectTypes;
      }

      return TicketingSearchService.search(options);
    }

    function onTagAdding($tag) {
      return (self.newTags.length < maxTags) && !_isDuplicatedTag($tag, self.newTags);
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

    function _denormalizeOptions(options) {
      var denormalizedOptions = {
        limit: DEFAULT_SEARCH_LIMIT
      };

      if (!options) {
        return denormalizedOptions;
      }

      angular.forEach(Object.keys(options), function(key) {
        if (Array.isArray(options[key])) {
          denormalizedOptions[key + '[]'] = options[key];
        }

        denormalizedOptions[key] = options[key];
      });

      return denormalizedOptions;
    }
  }
})(angular);
