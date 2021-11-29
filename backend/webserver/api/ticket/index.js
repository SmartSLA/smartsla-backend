'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const middlewares = require('./middleware')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

  /**
   * @swagger
   * /ticketing/api/tickets:
   *  post:
   *    tags:
   *      - Ticket
   *    description: Create a new ticket.
   *    responses:
   *      201:
   *        $ref: "#/responses/ticket"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/tickets',
    authorizationMW.requiresAPILogin,
    middlewares.transformTicket,
    middlewares.canCreateTicket,
    controller.create
  );

  /**
  * @swagger
  * /ticketing/api/tickets:
  *  head:
  *    tags:
  *      - Ticket
  *    description: Get tickets count.
  *    responses:
  *      200:
  *        $ref: "#/responses/cm_200"
  *      401:
  *        $ref: "#/responses/cm_401"
  *      403:
  *        $ref: "#/responses/cm_403"
  *      404:
  *        $ref: "#/responses/cm_404"
  *      500:
  *        $ref: "#/responses/cm_500"
  */
  router.head('/tickets',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    controller.count
  );

  /**
  * @swagger
  * /ticketing/api/tickets:
  *  get:
  *    tags:
  *      - Ticket
  *    description: Get tickets list.
  *    responses:
  *      200:
  *        $ref: "#/responses/tickets"
  *      401:
  *        $ref: "#/responses/cm_401"
  *      403:
  *        $ref: "#/responses/cm_403"
  *      404:
  *        $ref: "#/responses/cm_404"
  *      500:
  *        $ref: "#/responses/cm_500"
  */
  router.get('/tickets',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/tickets/search:
   *  get:
   *    tags:
   *      - Ticket
   *    description: Search tickets by a given query.
   *    parameters:
   *      - $ref: "#/parameters/query"
   *    responses:
   *      200:
   *        $ref: "#/responses/tickets"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/tickets/search',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    controller.search
  );

  /**
   * @swagger
   * /ticketing/api/tickets/{id}:
   *  get:
   *    tags:
   *      - Ticket
   *    description: Get ticket by number.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      200:
   *        $ref: "#/responses/ticket"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/tickets/:id',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    userMiddleware.loadTicketingUser,
    middlewares.loadTicket,
    middlewares.canReadTicket,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/tickets/{id}/events:
   *  put:
   *    tags:
   *      - Ticket
   *    description: add an event to a ticket by number.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      200:
   *        $ref: "#/responses/ticket"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.put('/tickets/:id/events',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    userMiddleware.loadTicketingUser,
    middlewares.canPutPrivateComment,
    controller.addEvent
  );

  /**
   * @swagger
   * /ticketing/api/tickets/{id}/events/{eventId}/comment:
   *  patch:
   *    tags:
   *      - Ticket
   *    description: add deleted flag to a ticket event.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      200:
   *        $ref: "#/responses/ticket"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.patch('/tickets/:id/events/:eventId/comment',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    middlewares.loadTicket,
    userMiddleware.loadTicketingUser,
    middlewares.canDeleteOrUpdateComment,
    controller.deleteComment
  );

    /**
   * @swagger
   * /ticketing/api/tickets/{id}/events/{eventId}/comment:
   *  patch:
   *    tags:
   *      - Ticket
   *    description: Edit comment.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      200:
   *        $ref: "#/responses/ticket"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
    router.put('/tickets/:id/events/:eventId/comment',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    middlewares.loadTicket,
    userMiddleware.loadTicketingUser,
    middlewares.canDeleteOrUpdateComment,
    controller.updateComment
  );

  /**
   * @swagger
   * /ticketing/api/tickets/{id}/contributions:
   *  post:
   *    tags:
   *      - Ticket
   *    description: Update ticket related contributions by number.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      204:
   *        $ref: "#/responses/cm_204"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/tickets/:id/contributions',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    userMiddleware.loadTicketingUser,
    middlewares.canUpdateRelatedContributions,
    controller.updateRelatedContributions
  );

  /**
   * @swagger
   * /ticketing/api/tickets/{id}:
   *  post:
   *    tags:
   *      - Ticket
   *    description: Update a ticket by number.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      200:
   *        $ref: "#/responses/ticket"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/tickets/:id',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    middlewares.checkTicketIdInParams,
    middlewares.canUpdateTicket,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/tickets/{id}:
   *  delete:
   *    tags:
   *      - Ticket
   *    description: Deletes a ticket by a given number.
   *    parameters:
   *      - $ref: "#/parameters/ticket_number"
   *    responses:
   *      204:
   *        $ref: "#/responses/cm_204"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.delete('/tickets/:id',
    authorizationMW.requiresAPILogin,
    middlewares.checkTicketIdInParams,
    middlewares.loadTicket,
    middlewares.canDeleteTicket,
    controller.remove
  );
};
