'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

  const {
    load,
    canCreateContract,
    canListContract,
    canUpdateContract,
    canAddUsersToContract,
    canReadContract
  } = require('./middleware')(dependencies, lib);

  /**
   * @swagger
   * /ticketing/api/contracts:
   *  get:
   *    tags:
   *      - Contract
   *    description: get contracts list
   *    responses:
   *      201:
   *        $ref: "#/responses/contracts"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/contracts',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    canListContract,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/contracts/{id}:
   *  get:
   *    tags:
   *      - Contract
   *    description: get contract by id
   *    responses:
   *      201:
   *        $ref: "#/responses/contract"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canReadContract,
    checkIdInParams('id', 'Contract'),
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/contracts:
   *  post:
   *    tags:
   *      - Contract
   *    desciprion: Create a new contract
   *    responses:
   *      201:
   *        $ref: "#/responses/contract"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/contracts',
    authorizationMW.requiresAPILogin,
    canCreateContract,
    controller.create
  );

/**
 * @swagger
 * /ticketing/api/contracts/{id}:
 *  post:
 *    tags:
 *      - Contract
 *    description: update a contract by id
 *    responses:
 *      201:
 *        $ref: "#/responses/contract"
 *      401:
 *        $ref: "#/responses/cm_401"
 *      403:
 *        $ref: "#/responses/cm_403"
 *      404:
 *        $ref: "#/responses/cm_404"
 *      500:
 *        $ref: "#/responses/cm_500"
 */
  router.post('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContract,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/contracts/{id}/users:
   *  post:
   *    tags:
   *      - Contract
   *    description: add user to contract by id
   *    parameters:
   *      - $ref: "#/parameters/contract_id"
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
  router.post('/contracts/:id/users',
    authorizationMW.requiresAPILogin,
    load,
    canAddUsersToContract,
    controller.addUsers
  );

  /**
   * @swagger
   * /ticketing/api/contracts/{id}/users:
   *  get:
   *    tags:
   *      - Contract
   *    description: get user contracts by id
   *    parameters:
   *      - $ref: "#/parameters/contract_id"
   *    responses:
   *      200:
   *        $ref: "#/responses/contract_users"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/contracts/:id/users',
    authorizationMW.requiresAPILogin,
    load,
    controller.getUsers
  );

  /**
   * @swagger
   * /ticketing/api/contract/:id/tickets:
   *  get:
   *    tags:
   *      - Contract
   *    description: get tickets by contract using contract id
   *    parameters:
   *      - $ref: "#/parameters/contract_id"
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
  router.get('/contract/:id/tickets',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    load,
    controller.getTicketsByContract
  );

  /**
   * @swagger
   * /ticketing/api/contracts/{id}:
   *  delete:
   *    tags:
   *      - Contract
   *    description: delete a contract by id
   *    parameters:
   *      - $ref: "#/parameters/contract_id"
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
  router.delete('/contracts/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContract,
    checkIdInParams('id', 'Contract'),
    controller.remove
  );

};
