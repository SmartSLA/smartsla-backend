(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareListController', TicketingSoftwareListController);

  function TicketingSoftwareListController(
    $scope,
    $modal,
    infiniteScrollHelper,
    TicketingSoftwareService,
    TICKETING_SOFTWARE_EVENTS
  ) {
    var self = this;
    var DEFAULT_LIMIT = 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
      self.onCreateBtnClick = onCreateBtnClick;

      $scope.$on(TICKETING_SOFTWARE_EVENTS.CREATED, function(event, software) {
        _onSoftwareCreated(software);
      });
    }

    function onCreateBtnClick() {
      $modal({
        templateUrl: '/ticketing/app/software/create/ticketing-software-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingSoftwareCreateController'
      });
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return TicketingSoftwareService.list(options);
    }

    function _onSoftwareCreated(software) {
      if (!software) {
        return;
      }

      self.elements.unshift(software);
    }
  }
})(angular);
