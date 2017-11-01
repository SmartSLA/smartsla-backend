(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingOrganizationDetailSubheader', {
    templateUrl: '/ticketing/app/organization/detail/subheader/ticketing-organization-detail-subheader.html',
    bindings: {
      isEditMode: '<',
      onEditBtnClick: '&',
      onCancelBtnClick: '&',
      onSaveBtnClick: '&',
      form: '<',
      selectedTab: '<',
      organization: '<'
    }
  });
})(angular);
