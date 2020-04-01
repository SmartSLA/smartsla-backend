'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    canCreateSoftware,
    canListSoftware,
    canUpdateSoftware,
    validateSoftwareUpdatePayload
  } = require('./middleware')(dependencies, lib);

  /**
   * @swagger
   * /ticketing/api/software:
   *  get:
   *    tags:
   *      - Software
   *    description: Get software list
   *    responses:
   *      200:
   *        $ref: "#/responses/software_list"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/software',
    authorizationMW.requiresAPILogin,
    canListSoftware,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/software/{id}:
   *  get:
   *    tags:
   *      - Software
   *    description: Get software by id
   *    parameters:
   *      - $ref: "#/parameters/software_id"
   *    responses:
   *      200:
   *        $ref: "#/responses/software"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/software/:id',
    authorizationMW.requiresAPILogin,
    canListSoftware,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/software:
   *  post:
   *    tags:
   *      - Software
   *    description: Create a new software
   *    responses:
   *      201:
   *        $ref: "#/responses/software"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/software',
    authorizationMW.requiresAPILogin,
    canCreateSoftware,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/software/{id}:
   *  put:
   *    tags:
   *      - Software
   *    description: Update a software by id
   *    parameters:
   *      - $ref: "#/parameters/software_id"
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
  router.put('/software/:id',
    authorizationMW.requiresAPILogin,
    canUpdateSoftware,
    checkIdInParams('id', 'Software'),
    validateSoftwareUpdatePayload,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/software:
   *  delete:
   *    tags:
   *      - Software
   *    description: delete a software by id
   *    parameters:
   *      - $ref: "#/parameters/software_id"
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
  router.delete('/software/:id',
    authorizationMW.requiresAPILogin,
    canUpdateSoftware,
    checkIdInParams('id', 'Software'),
    controller.remove
  );
};
