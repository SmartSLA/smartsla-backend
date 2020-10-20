'use strict';

module.exports = function(dependencies, lib, router) {
  const { canCreateTicket } = require('./middleware')(dependencies, lib);
  const controller = require('./controller')(dependencies, lib);

  /**
  * @swagger
  * /ticketing/api/lininfosec:
  *  get:
  *    tags:
  *      - LinInfoSec
  *    responses:
  *      200:
  *        $ref: "#/responses/lininfosec"
  *      401:
  *        $ref: "#/responses/cm_401"
  *      403:
  *        $ref: "#/responses/cm_403"
  *      404:
  *        $ref: "#/responses/cm_404"
  *      500:
  *        $ref: "#/responses/cm_500"
  */
  router.post('/lininfosec',
    // TO DO: Add the authentification!!
    canCreateTicket,
    controller.create
  );
};
