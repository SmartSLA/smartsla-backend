'use strict';

module.exports = function(dependencies, lib, router) {
  const { checkIdInParams } = dependencies('helperMw');
  const authorizationMW = dependencies('authorizationMW');
  const controller = require('./controller')(dependencies, lib);
  const {
    validateFilterCreatePayload,
    validateFilterUpdatePayload
  } = require('./middleware')(dependencies, lib);

  /**
   * @swagger
   * /ticketing/api/filters:
   *  get:
   *    tags:
   *      - Filter
   *    description: Get filters list of connected user
   *    responses:
   *      200:
   *        $ref: "#/responses/filters"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/filters',
    authorizationMW.requiresAPILogin,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/filters/{id}:
   *  get:
   *    tags:
   *      - Filter
   *    description: Get filter by id
   *    parameters:
   *      - $ref: "#/parameters/filter_id"
   *    responses:
   *      200:
   *        $ref: "#/responses/filter"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/filters/:id',
    authorizationMW.requiresAPILogin,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/filters:
   *  post:
   *    tags:
   *      - Filter
   *    description: Create a new filter
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
  router.post('/filters',
    authorizationMW.requiresAPILogin,
    validateFilterCreatePayload,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/filters/{id}:
   *  put:
   *    tags:
   *      - Filter
   *    description: Update filter by id
   *    parameters:
   *      - $ref: "#/parameters/filter_id"
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
  router.put('/filters/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'filter'),
    validateFilterUpdatePayload,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/filters/{id}:
   *  delete:
   *    tags:
   *      - Filter
   *    description: Delete a filter by id
   *    parameters:
   *      - $ref: "#/parameters/filter_number"
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
  router.delete('/filters/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'filter'),
    controller.remove
  );
};
