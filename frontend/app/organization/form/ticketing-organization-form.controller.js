(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingOrganizationFormController', TicketingOrganizationFormController);

  function TicketingOrganizationFormController() {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.organization = self.organization || {};
      self.managers = self.organization.manager ? [self.organization.manager] : [];
      self.onManagerChange = onManagerChange;
    }

    function onManagerChange() {
      self.organization.manager = self.managers.length ? self.managers[0] : null;
    }
  }
})(angular);
