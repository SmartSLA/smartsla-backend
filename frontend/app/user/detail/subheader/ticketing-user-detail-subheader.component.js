(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')

  .component('ticketingUserDetailSubheader', {
    templateUrl: '/ticketing/app/user/detail/subheader/ticketing-user-detail-subheader.html',
    bindings: {
      isEditMode: '<',
      onEditBtnClick: '&',
      onCancelBtnClick: '&',
      onSaveBtnClick: '&',
      form: '<',
      selectedTab: '<',
      user: '<'
    }
  });
})(angular);
