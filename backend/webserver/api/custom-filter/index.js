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
   * /ticketing/api/custom-filters:
   *  get:
   *    tags:
   *      - Filter
   *    description: Get custom filters list of connected user
   *    responses:
   *      200:
   *        $ref: "#/responses/custom-filters"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/custom-filters',
    authorizationMW.requiresAPILogin,
    controller.list
  );

  /**
   * @swagger
   * /ticketing/api/custom-filters/{id}:
   *  get:
   *    tags:
   *      - Filter
   *    description: Get custom filter by id
   *    parameters:
   *      - $ref: "#/parameters/filter_id"
   *    responses:
   *      200:
   *        $ref: "#/responses/custom-filter"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/custom-filters/:id',
    authorizationMW.requiresAPILogin,
    controller.get
  );

  /**
   * @swagger
   * /ticketing/api/custom-filters:
   *  post:
   *    tags:
   *      - Filter
   *    description: Create a new  custom filter
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
  router.post('/custom-filters',
    authorizationMW.requiresAPILogin,
    validateFilterCreatePayload,
    controller.create
  );

  /**
   * @swagger
   * /ticketing/api/custom-filters/{id}:
   *  put:
   *    tags:
   *      - Filter
   *    description: Update custom filter by id
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
  router.put('/custom-filters/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'filter'),
    validateFilterUpdatePayload,
    controller.update
  );

  /**
   * @swagger
   * /ticketing/api/custom-filters/{id}:
   *  delete:
   *    tags:
   *      - Filter
   *    description: Delete a custom filter by id
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
  router.delete('/custom-filters/:id',
    authorizationMW.requiresAPILogin,
    checkIdInParams('id', 'filter'),
    controller.remove
  );
};
