(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingUserAutoCompleteController', TicketingUserAutoCompleteController);

  function TicketingUserAutoCompleteController($element, TicketingUserService, elementScrollService, _) {
    var self = this;

    self.search = TicketingUserService.searchUserCandidates;
    self.maxTags = self.maxTags === '' || !self.maxTags ? 'MAX_SAFE_INTEGER' : self.maxTags; // http://mbenford.github.io/ngTagsInput/documentation/api

    self.onTagAdding = function($tag) {
      return !_isDuplicatedUser($tag, self.newUsers);
    };

    self.onTagAdded = function() {
      elementScrollService.autoScrollDown($element.find('div.tags'));
    };

    function _isDuplicatedUser(newUser, users) {
      return !!_.find(users, { id: newUser.id });
    }
  }
})(angular);
