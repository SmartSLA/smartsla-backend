(function(angular) {
  angular.module('linagora.esn.ticketing')
    .factory('TicketingTicketLiveUpdate', TicketingTicketLiveUpdate);

  function TicketingTicketLiveUpdate(
    $rootScope,
    $log,
    livenotification,
    TICKETING_TICKET_EVENTS,
    TICKETING_TICKET_WS
  ) {
    var sio = null;
    var listening = false;

    return {
      startListen: startListen,
      stopListen: stopListen
    };

    function startListen(ticketId) {
      if (listening) { return; }

      if (sio === null) {
        sio = livenotification(TICKETING_TICKET_WS.namespace, ticketId);
      }

      sio.on(TICKETING_TICKET_WS.events.UPDATED, _onUpdate);

      listening = true;
      $log.debug('Start listening ticket live update');
    }

    function stopListen() {
      if (!listening) { return; }

      if (sio) {
        sio.removeListener(TICKETING_TICKET_WS.events.UPDATED, _onUpdate);
      }

      listening = false;
      $log.debug('Stop listening ticket live update');
    }

    function _onUpdate(data) {
      $rootScope.$broadcast(TICKETING_TICKET_EVENTS.UPDATED, data);
    }
  }
})(angular);
