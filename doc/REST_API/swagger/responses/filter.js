/**
 * @swagger
 * response:
 *  filters:
 *    description: OK with filters list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/filter"
 *    exemples:
 *      application/json:
 *        [
 *          {
 *            "_id": "closed",
 *            "name": "Closed tickets"
 *          },
 *          {
 *            "_id": "open",
 *            "name": "Open tickets"
 *          }
 *        ]
 */
