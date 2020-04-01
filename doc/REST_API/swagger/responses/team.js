/**
 * @swagger
 * response:
 *  team:
 *    description: OK with team object
 *    schema:
 *      $ref: "#/definitions/team_content"
 *    examples:
 *      application/json:
 *        {
 *        "timestamps": {
 *          "creation": "2020-03-11T15:48:03.585Z"
 *        },
 *        "alertSystemActive": false,
 *        "testAlertSystemActive": false,
 *        "contracts": [],
 *        "_id": "5e6908332891b92465cb1fe9",
 *        "name": "TAO Pizza Team",
 *        "email": "test@linagora.com",
 *        }
 *  teams:
 *    description: Ok with the team list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/team_content"
 *    examples:
 *      applications/json:
 *        [
 *        {
 *          "timestamps": {
 *            "creation": "2020-03-11T15:48:03.585Z"
 *          },
 *          "alertSystemActive": false,
 *          "testAlertSystemActive": false,
 *          "contracts": [],
 *          "_id": "5e6908332891b92465cb1fe9",
 *          "name": "TAO Pizza Team",
 *          "email": "test@linagora.com",
 *        },
 *        {
 *          "timestamps": {
 *            "creation": "2020-02-13T16:36:01.482Z"
 *          },
 *          "alertSystemActive": false,
 *          "testAlertSystemActive": false,
 *          "contracts": [],
 *          "_id": "5e457af17c72893da8f28a9d",
 *          "name": "caseSensitive",
 *          "email": "test",
 *        }
 *        ]
 */
