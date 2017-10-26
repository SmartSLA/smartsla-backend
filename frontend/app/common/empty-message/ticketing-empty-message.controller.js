(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .controller('ticketingEmptyMessageController', ticketingEmptyMessageController);

  function ticketingEmptyMessageController() {
    var self = this;
    var AVAILABLE_TYPES = {
      error: 'mdi-alert-circle'
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.icon = self.icon || AVAILABLE_TYPES[self.type];
    }
  }
})(angular);
