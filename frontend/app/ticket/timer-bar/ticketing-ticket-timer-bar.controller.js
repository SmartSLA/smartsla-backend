(function(angular) {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('TicketingTicketTimerBarController', TicketingTicketTimerBarController);

  function TicketingTicketTimerBarController($filter, esnI18nService) {
    var self = this;
    var caculateProgress;

    self.$onInit = $onInit;
    self.$onDestroy = $onDestroy;

    function $onInit() {
      if (self.countdown > 0) {
        self.progress = self.passed * 100 / self.countdown;
        self.label = _buildLabel(self.countdown - self.passed);

        if (self.progress < 100) {
          caculateProgress = setInterval(function() {
            if (self.progress > 100) {
              clearInterval(caculateProgress);
            } else {
              self.passed ++;
              self.progress = self.passed * 100 / self.countdown;
            }

            self.label = _buildLabel(self.countdown - self.passed);
          }, self.interval);
        }
      } else {
        self.progress = 0;
        self.label = '∞';
      }
    }

    function $onDestroy() {
      clearInterval(caculateProgress);
    }

    function _buildLabel(remainder) {
      if (remainder < 0) {
        return esnI18nService.translate('Expired').toString();
      }

      return esnI18nService.translate('%s remaining', $filter('ticketingTime')(Math.round(remainder))).toString();
    }
  }
})(angular);
