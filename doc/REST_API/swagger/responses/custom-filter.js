/**
 * @swagger
 * response:
 *  custom-filter:
 *    description: Ok with the filter object
 *    schema:
 *      $ref: "#/definitions/filter_content"
 *    examples:
 *      application/json:
 *        {
 *        "timestamps": {
 *          "creation": "2020-02-14T15:03:43.708Z"
 *        },
 *        "_id": "5e46b6cf7c72893da8f296a7",
 *        "name": "thunderbird",
 *        "items": [
 *          {
 *            "category": "Software",
 *            "value": "Thunderbird"
 *          }
 *        ],
 *        "user": "5bd18e5477f6bb734331c3f1",
 *        }
 *  custom-filters:
 *    description: Ok with the filters list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/filter_content"
 *    examples:
 *      application/json:
 *        [
 *        {
 *          "timestamps": {
 *            "creation": "2020-02-14T15:03:43.708Z"
 *          },
 *          "_id": "5e46b6cf7c72893da8f296a7",
 *          "name": "thunderbird",
 *          "items": [
 *            {
 *              "category": "Software",
 *              "value": "Thunderbird"
 *            }
 *          ],
 *          "user": "5bd18e5477f6bb734331c3f1",
 *        },
 *        {
 *          "timestamps": {
 *            "creation": "2020-02-13T10:20:09.636Z"
 *          },
 *          "_id": "5e4522d9f00f0817f71f4bd4",
 *          "name": "A",
 *          "items": [
 *            {
 *              "category": "Type",
 *              "value": "Information"
 *            }
 *          ],
 *          "user": "5bd18e5477f6bb734331c3f1",
 *        }
 *        ]
 */
