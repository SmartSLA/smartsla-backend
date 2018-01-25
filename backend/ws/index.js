'use strict';

const NAMESPACE = '/ticketing/tickets';
const { NOTIFICATIONS } = require('../lib/constants');

let initialized = false;
let ticketNamespace;

module.exports = dependencies => {
  const logger = dependencies('logger');
  const pubsub = dependencies('pubsub').global;
  const io = dependencies('wsserver').io;

  return {
    init
  };

  function init() {
    if (initialized) {
      logger.warn('The ticket notification service is already initialized');

      return;
    }

    function synchronizeActivitiesLists(event, data) {
      if (ticketNamespace) {
        ticketNamespace.to(String(data.object._id)).emit(event, {
          room: String(data.object._id),
          data
        });
      }
    }

    pubsub.topic(NOTIFICATIONS.updated).subscribe(data => {
      logger.info('Notifying ticket update');
      synchronizeActivitiesLists('ticketing:ticket:updated', data);
    });

    ticketNamespace = io.of(NAMESPACE);
    ticketNamespace.on('connection', socket => {
      logger.info('New connection on ' + NAMESPACE);

      socket.on('subscribe', ticketId => {
        logger.info('Joining ticket room', ticketId);
        socket.join(ticketId);
      });

      socket.on('unsubscribe', ticketId => {
        logger.info('Leaving ticket room', ticketId);
        socket.leave(ticketId);
      });
    });

    initialized = true;
  }
};
