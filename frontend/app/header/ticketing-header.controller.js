(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingHeaderController', TicketingHeaderController);

  function TicketingHeaderController(session, TICKETING_USER_ROLES) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.canAccessAllIssuesPage = canAccessAllIssuesPage;
      self.canAccessAdminPage = canAccessAdminPage;
    }

    function canAccessAllIssuesPage() {
      return [TICKETING_USER_ROLES.administrator, TICKETING_USER_ROLES.supporter].indexOf(session.user.role) !== -1;
    }

    function canAccessAdminPage() {
      return session.user.role === TICKETING_USER_ROLES.administrator;
    }
  }
})(angular);
