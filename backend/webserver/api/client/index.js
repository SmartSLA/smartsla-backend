'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateClient,
    canListClient,
    canUpdateClient,
    clientCanBeRemoved
  } = require('./middleware')(dependencies, lib);

  /**
  * @swagger
  * /ticketing/api/client:
  *  get:
  *    tags:
  *      - Client
  *    description: Get clients list.
  *    responses:
  *      200:
  *        $ref: "#/responses/clients"
  *      401:
  *        $ref: "#/responses/cm_401"
  *      403:
  *        $ref: "#/responses/cm_403"
  *      404:
  *        $ref: "#/responses/cm_404"
  *      500:
  *        $ref: "#/responses/cm_500"
  */
  router.get('/client',
    authorizationMW.requiresAPILogin,
    canListClient,
    controller.list
  );

  /**
  * @swagger
  * /ticketing/api/client/{id}:
  *  get:
  *    tags:
  *      - Client
  *    description: Get client by id.
  *    responses:
  *      200:
  *        $ref: "#/responses/client"
  *      401:
  *        $ref: "#/responses/cm_401"
  *      403:
  *        $ref: "#/responses/cm_403"
  *      404:
  *        $ref: "#/responses/cm_404"
  *      500:
  *        $ref: "#/responses/cm_500"
  */
  router.get('/client/:id',
    authorizationMW.requiresAPILogin,
    canListClient,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/client:
   *  post:
   *    tags:
   *      - Ticket
   *    description: create a new client.
   *    responses:
   *      200:
   *        $ref: "#/responses/client"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/client',
    authorizationMW.requiresAPILogin,
    canCreateClient,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/client/{id}:
   *  post:
   *    tags:
   *      - Ticket
   *    description: Update a client by id.
   *    parameters:
   *      - $ref: "#/parameters/client_id"
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
  router.post('/client/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'client'),
    canUpdateClient,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/client/{id}:
   *  delete:
   *    tags:
   *      - Ticket
   *    description: Deletes a client by a given id.
   *    parameters:
   *      - $ref: "#/parameters/client_id"
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
  router.delete('/client/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'client'),
    canUpdateClient,
    clientCanBeRemoved,
    controller.remove
  );
};
