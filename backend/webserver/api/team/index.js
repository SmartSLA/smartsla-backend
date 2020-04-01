'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateTeam,
    canListTeam,
    canUpdateTeam
  } = require('./middleware')(dependencies, lib);

  /**
   * @swagger
   * /ticketing/api/team:
   *  get:
   *    tags:
   *      - Team
   *    description: Get team list
   *    responses:
   *      200:
   *        $ref: "#/responses/teams"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/team',
    authorizationMW.requiresAPILogin,
    canListTeam,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/team/{id}:
   *  get:
   *    tags:
   *      - Team
   *    description: Get team by id
   *    parameters:
   *      - $ref: "#/parameters/team_id"
   *    responses:
   *      200:
   *        $ref: "#/responses/team"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/team/:id',
    authorizationMW.requiresAPILogin,
    canListTeam,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/team:
   *  post:
   *    tags:
   *      - Team
   *    description: Create a new team
   *    responses:
   *      201:
   *        $ref: "#/responses/team"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/team',
    authorizationMW.requiresAPILogin,
    canCreateTeam,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/team/{id}:
   *  put:
   *    tags:
   *      - Team
   *    description: Update a team by id
   *    parameters:
   *      - $ref: "#/parameters/team_id"
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
  router.put('/team/:id',
    authorizationMW.requiresAPILogin,
    canUpdateTeam,
    checkIdInParams('id', 'team'),
    canUpdateTeam,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/team/{id}:
   *  delete:
   *    tags:
   *      - Team
   *    description: Delete a team by id
   *    parameters:
   *      - $ref: "#/parameters/team_id"
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
  router.delete('/team/:id',
    authorizationMW.requiresAPILogin,
    canUpdateTeam,
    checkIdInParams('id', 'team'),
    controller.remove
  );
};
