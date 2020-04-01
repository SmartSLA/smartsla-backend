/**
 * @swagger
 * response:
 *  client:
 *    description: ok with client object
 *    schema:
 *      $ref: "#/definitions/client_content"
 *    examples:
 *      application/json:
 *        {
 *        "_id": "5e7e02fe81e3d43b645ed282",
 *        "timestamps": {
 *          "creation": "2020-03-27T13:43:26.892Z"
 *        },
 *        "active": true,
 *        "name": "SNCF",
 *        "contracts":
 *        [
 *          {
 *            "_id": "5e7e034981e3d43b645ed284",
 *            "name": "Contract SNCF 2020"
 *          }
 *        ]
 *        }
 *  clients:
 *    description: ok with the clients list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/client_content"
 *    examples:
 *      application/json:
 *        [
 *        {
 *          "timestamps": {
 *            "creation": "2020-03-27T13:43:26.892Z"
 *          },
 *          "active": true,
 *          "_id": "5e7e02fe81e3d43b645ed282",
 *          "name": "SNCF",
 *        },
 *        {
 *          "timestamps": {
 *            "creation": "2020-03-26T09:17:06.188Z"
 *          },
 *          "active": true,
 *          "_id": "5e7c73123687003605f59305",
 *          "name": "Ministère du bien être",
 *          "address": "Paris",
 *        }
 *        ]
 */
