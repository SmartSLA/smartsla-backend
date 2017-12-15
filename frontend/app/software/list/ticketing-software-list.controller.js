(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingSoftwareListController', TicketingSoftwareListController);

  function TicketingSoftwareListController(
    $scope,
    $modal,
    infiniteScrollHelper,
    TicketingSoftwareService,
    _,
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
      self.onEditBtnClick = onEditBtnClick;

      $scope.$on(TICKETING_SOFTWARE_EVENTS.CREATED, function(event, software) {
        _onSoftwareCreated(software);
      });

      $scope.$on(TICKETING_SOFTWARE_EVENTS.UPDATED, function(event, updatedSoftware) {
        _onSoftwareUpdated(updatedSoftware);
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

    function onEditBtnClick(software) {
      $modal({
        templateUrl: '/ticketing/app/software/edit/ticketing-software-edit.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'TicketingSoftwareEditController',
        locals: {
          software: software
        }
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

    function _onSoftwareUpdated(updatedSoftware) {
      if (!updatedSoftware || !updatedSoftware._id) {
        return;
      }

      var index = _.findIndex(self.elements, { _id: updatedSoftware._id });

      if (index !== -1) {
        self.elements[index] = updatedSoftware;
      }
    }
  }
})(angular);
