'use strict';

module.exports = function(dependencies, lib, router) {
  const authorizationMW = dependencies('authorizationMW');
  const userMiddleware = require('../user/middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);

  /**
  * @swagger
  * /ticketing/api/filters:
  *  get:
  *    tags:
  *      - Filter
  *    description: Get filters list.
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
    userMiddleware.loadTicketingUser,
    controller.list
  );
};
