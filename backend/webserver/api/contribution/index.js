'use strict';

module.exports = function(dependencies, lib, router) {
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateContribution,
    canUpdateContribution,
    canRemoveContribution,
    validateContributionCreatePayload,
    validateContributionUpdatePayload,
    validateContributionStatusUpdatePayload
  } = require('./middleware')(dependencies, lib);

  /**
  * @swagger
  * /ticketing/api/contributions:
  *  get:
  *    tags:
  *      - Contribution
  *    description: Get contributions list
  *    responses:
  *      200:
  *        $ref: "#/responses/contributions"
  *      401:
  *        $ref: "#/responses/cm_401"
  *      403:
  *        $ref: "#/responses/cm_403"
  *      404:
  *        $ref: "#/responses/cm_404"
  *      500:
  *        $ref: "#/responses/cm_500"
  */
  router.get('/contributions',
    authorizationMW.requiresAPILogin,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/contributions/{id}:
   *  get:
   *    tags:
   *      - Contribution
   *    description: Get contribution by number
   *    parameters:
   *      - $ref: "#/parameters/contribution_id"
   *    responses:
   *      200:
   *        $ref: "#/responses/contribution"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/contributions/:id',
    authorizationMW.requiresAPILogin,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/contributions:
   *  post:
   *    tags:
   *      - Contribution
   *  desciprion: Create a new contribution
   *  responses:
   *      201:
   *        $ref: "#/responses/contribution"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/contributions',
    authorizationMW.requiresAPILogin,
    canCreateContribution,
    validateContributionCreatePayload,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/contributions/{id}:
   *  post:
   *    tags:
   *      - Contribution
   *    description: Update a contribution by number
   *    parameters:
   *      - $ref: "#/parameters/contribution_id"
   *    responses:
   *      200:
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
  router.post('/contributions/:id',
    authorizationMW.requiresAPILogin,
    canUpdateContribution,
    validateContributionUpdatePayload,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/contributions/{id}/status:
   *  post:
   *    tags:
   *      - Contribution
   *    description: Update contribution status by number
   *    parameters:
   *      - $ref: "#/parameters/contribution_id"
   *    responses:
   *      201:
   *        $ref: "#/responses/cm_201"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/contributions/:id/status',
    authorizationMW.requiresAPILogin,
    canUpdateContribution,
    validateContributionStatusUpdatePayload,
    controller.updateStatus
  );

  /**
   * @swagger
   * /ticketing/api/contributions/{id}:
   *  delete:
   *    tags:
   *      - Contribution
   *    description: Delete a contribution by number
   *    parameters:
   *      - $ref: "#/parameters/contribution_id"
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
  router.delete('/contributions/:id',
    authorizationMW.requiresAPILogin,
    canRemoveContribution,
    controller.remove
  );
};
