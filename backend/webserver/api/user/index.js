'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const domainMW = dependencies('domainMW');
  const { checkIdInParams } = dependencies('helperMw');
  const middleware = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);
  const userMiddleware = require('../user/middleware')(dependencies, lib);

  /**
   * @swagger
   * /ticketing/api/users:
   *  get:
   *    tags:
   *      - Users
   *    description: Get users list
   *    responses:
   *      200:
   *        $ref: "#/responses/users"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/users',
    authorizationMW.requiresAPILogin,
    middleware.canList,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/users/{id}:
   *  get:
   *    tags:
   *      - Users
   *    description: Get user by id
   *    parameters:
   *      - $ref: "#/parameters/user_id"
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
  router.get('/users/:id',
    authorizationMW.requiresAPILogin,
    middleware.canRead,
    checkIdInParams('id', 'User'),
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/users:
   *  post:
   *    tags:
   *      - Users
   *    description: Create a new user
   *    responses:
   *      201:
   *        $ref: "#/responses/user"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/users',
    authorizationMW.requiresAPILogin,
    middleware.canCreate,
    domainMW.loadSessionDomain,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/users/{id}:
   *  put:
   *    tags:
   *      - Users
   *    description: update user by id
   *    parameters:
   *      - $ref: "#/parameters/user_id"
   *    responses:
   *      201:
   *        $ref: "#/responses/user"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.put('/users/:id',
    authorizationMW.requiresAPILogin,
    userMiddleware.loadTicketingUser,
    middleware.canUpdate,
    checkIdInParams('id', 'User'),
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/user:
   *  get:
   *    tags:
   *      - Users
   *    description: get currently connected user
   *    responses:
   *      200:
   *        $ref: "#/responses/user"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/user',
    authorizationMW.requiresAPILogin,
    domainMW.loadSessionDomain,
    userMiddleware.loadTicketingUser,
    controller.getCurrentUser
  );

  /**
   * @swagger
   * /ticketing/api/user/role:
   *  get:
   *    tags:
   *      - Users
   *    description: Get current user role
   *    responses:
   *      200:
   *        $ref: "#/responses/user_role"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/user/role',
    authorizationMW.requiresAPILogin,
    controller.getRole
  );

  /**
   * @swagger
   * /ticketing/api/users/{id}:
   *  delete:
   *    tags:
   *      - Users
   *    description: Delete user by id
   *    parameters:
   *      - $ref: "#/parameters/user_id"
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
  router.delete('/users/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'User'),
    userMiddleware.canUpdate,
    controller.remove
  );
};
