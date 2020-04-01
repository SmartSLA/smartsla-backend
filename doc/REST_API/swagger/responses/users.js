/**
 * @swagger
 * response:
 *  user:
 *    description: Ok with user object
 *    schema:
 *      $ref: "#/definitions/user_content"
 *    examples:
 *      applications/json:
 *        {
 *        "timestamps": {
 *          "createdAt": "2019-10-31T16:48:29.795Z"
 *        },
 *        "type": "beneficiary",
 *        "_id": "5dbb105deace1e245d148abe",
 *        "user": "5d9b0e7f1100cb4bad83b994",
 *        "role": "customer",
 *        "email": "abbey.curry@open-paas.org",
 *        "name": "Abbey CURRY",
 *        "phone": "0645566666",
 *        "contracts": [
 *          {
 *            "timestamps": {
 *              "createdAt": "2020-02-13T10:20:48.668Z",
 *              "updatedAt": "2020-02-13T10:20:48.668Z"
 *            },
 *            "role": "viewer",
 *            "schemaVersion": 1,
 *            "_id": "5e452300f00f0817f71f4bf5",
 *            "user": "5d9b0e7f1100cb4bad83b994",
 *            "contract": {
 *              "_id": "5e3931c464fea431a7e0b724",
 *              "name": "OUB-C1-4FEV",
 *              "client": "oubra CHD",
 *              "clientId": "5e39316f64fea431a7e0b722"
 *            },
 *          }
 *        ]
 *        }
 *  users:
 *    description: Ok with users list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/user_content"
 *    examples:
 *      application/json:
 *        [
 *        {
 *        "timestamps": {
 *          "createdAt": "2019-10-31T16:48:29.795Z"
 *        },
 *        "type": "beneficiary",
 *        "_id": "5dbb105deace1e245d148abe",
 *        "user": "5d9b0e7f1100cb4bad83b994",
 *        "role": "customer",
 *        "email": "abbey.curry@open-paas.org",
 *        "name": "Abbey CURRY",
 *        "phone": "0645566666",
 *        "contracts": [
 *          {
 *            "timestamps": {
 *              "createdAt": "2020-02-13T10:20:48.668Z",
 *              "updatedAt": "2020-02-13T10:20:48.668Z"
 *            },
 *            "role": "viewer",
 *            "schemaVersion": 1,
 *            "_id": "5e452300f00f0817f71f4bf5",
 *            "user": "5d9b0e7f1100cb4bad83b994",
 *            "contract": {
 *              "_id": "5e3931c464fea431a7e0b724",
 *              "name": "OUB-C1-4FEV",
 *              "client": "oubra CHD",
 *              "clientId": "5e39316f64fea431a7e0b722"
 *            },
 *          }
 *        ]
 *      },
 *        {
 *          "timestamps": {
 *            "createdAt": "2019-10-31T16:48:29.795Z"
 *          },
 *          "type": "beneficiary",
 *          "_id": "5dbb105deace1e245d148abe",
 *          "user": "5d9b0e7f1100cb4bad83b994",
 *          "role": "customer",
 *          "email": "abbey.curry@open-paas.org",
 *          "name": "Abbey CURRY",
 *          "phone": "0645566666",
 *          "contracts": [
 *            {
 *              "timestamps": {
 *                "createdAt": "2020-02-13T10:20:48.668Z",
 *                "updatedAt": "2020-02-13T10:20:48.668Z"
 *              },
 *              "role": "viewer",
 *              "_id": "5e452300f00f0817f71f4bf5",
 *              "user": "5d9b0e7f1100cb4bad83b994",
 *              "contract": {
 *                "_id": "5e3931c464fea431a7e0b724",
 *                "name": "OUB-C1-4FEV",
 *                "client": "oubra CHD",
 *                "clientId": "5e39316f64fea431a7e0b722"
 *              },
 *            }
 *          ]
 *        },
 *        {
 *          "timestamps": {
 *            "createdAt": "2019-10-21T08:04:57.074Z"
 *          },
 *          "type": "expert",
 *          "_id": "5dad66a938c9ae2fd99f1a64",
 *          "user": "587e19b199ce9a50bbd4189b",
 *          "role": "expert",
 *          "email": "fmoyon@linagora.com",
 *          "name": "Fabien MOYON",
 *          "phone": "",
 *          "contracts": []
 *        }
 *        ]
 */
