(function(angular) {
  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketLiveUpdateInitializer', TicketingTicketLiveUpdateInitializer);

  function TicketingTicketLiveUpdateInitializer($rootScope, $stateParams, TicketingTicketLiveUpdate) {
    return {
      start: start
    };

    function start() {
      $rootScope.$on('$stateChangeSuccess', function(evt, current) {
        if (current && current.name &&
          (current.name === 'ticketing.tickets.detail')) {

          TicketingTicketLiveUpdate.startListen($stateParams.ticketId);
        } else {
          TicketingTicketLiveUpdate.stopListen();
        }
      });
    }
  }
})(angular);
