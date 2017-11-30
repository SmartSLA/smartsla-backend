(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSearchAutoCompleteController', TicketingSearchAutoCompleteController);

  function TicketingSearchAutoCompleteController(
    $scope,
    $element,
    elementScrollService,
    TicketingSearchService,
    _
  ) {
    var self = this;
    var DEFAULT_SEARCH_LIMIT = 20;

    self.$onInit = $onInit;

    function $onInit() {
      self.maxTags = self.maxTags === '' || !self.maxTags ? 'MAX_SAFE_INTEGER' : self.maxTags; // http://mbenford.github.io/ngTagsInput/documentation/api
      self.minTags = self.minTags === '' || !self.minTags ? 0 : self.minTags;
      self.addFromAutocompleteOnly = self.addFromAutocompleteOnly || true;
      self.objectTypes = _determineObjectTypes(self.objectTypes);
      self.onTagAdding = onTagAdding;
      self.onTagAdded = onTagAdded;
      self.search = search;
    }

    function search(query) {
      var limit = DEFAULT_SEARCH_LIMIT;
      var objectType = self.objectTypes;

      return TicketingSearchService.search(query, limit, objectType)
        .then(function(result) {
          if (self.exceptionListIds) {
            return _.map(result, function(item) {
              if (self.exceptionListIds.indexOf(item._id) === -1) {
                return item;
              }
            }).filter(Boolean);
          }
        });
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
