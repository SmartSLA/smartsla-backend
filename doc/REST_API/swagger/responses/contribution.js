/**
 * @swagger
 * response:
 *  contribution:
 *    description: Ok with contribution object
 *    schema:
 *      $ref: "#/definitions/contribution_content"
 *    examples:
 *      application/json:
 *        {
 *        "_id": 3,
 *        "timestamps": {
 *          "creation": "2020-03-11T13:58:34.966Z"
 *        },
 *        "status": {
 *          "develop": "2020-03-09T00:00:00.000Z",
 *          "reversed": "2020-03-26T00:00:00.000Z",
 *          "published": null,
 *          "integrated": "2020-03-09T00:00:00.000Z",
 *          "rejected": null
 *        },
 *        "links": [
 *          {
 *            "name": "Patch link",
 *            "url": "http://localhost"
 *          },
 *          {
 *            "name": "Patch link",
 *            "url": "http://google.com"
 *          }
 *        ],
 *        "name": "CONTRIBUTION",
 *        "software": {
 *          "_id": "5e554cef840d2c56eb64161c",
 *          "timestamps": {
 *            "creation": "2020-02-25T16:35:59.119Z"
 *          },
 *          "schemaVersion": 1,
 *          "name": "OpenLDAP",
 *          "summary": "OpenLDAP",
 *          "description": "OpenLDAP",
 *          "externalLinks": [],
 *        },
 *        "author": {
 *          "_id": "5d9ce2696f254d5cf1d1d3fb",
 *          "user": "540da7521dadc2c713b377ac",
 *          "role": "expert",
 *          "email": "chamerling@linagora.com",
 *          "name": "Christophe HAMERLING",
 *          "phone": "",
 *          "schemaVersion": 1,
 *          "type": "expert",
 *          "timestamps": {
 *            "createdAt": "2019-10-08T19:24:25.576Z"
 *          },
 *        },
 *        "type": "Backport",
 *        "version": "1",
 *        "fixedInVersion": "2",
 *        "deposedAt": "2020-03-25",
 *        "description": "zzd",
 *        }
 *  contributions:
 *    description: Ok with contribution list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/contribution_content"
 *    examples:
 *      application/json:
 *        [
 *        {
 *          "_id": 3,
 *          "timestamps": {
 *            "creation": "2020-03-11T13:58:34.966Z"
 *          },
 *          "status": {
 *            "develop": "2020-03-09T00:00:00.000Z",
 *            "reversed": "2020-03-26T00:00:00.000Z",
 *            "published": null,
 *            "integrated": "2020-03-09T00:00:00.000Z",
 *            "rejected": null
 *          },
 *          "schemaVersion": 1,
 *          "links": [
 *            {
 *              "name": "Patch link",
 *              "url": "http://localhost"
 *            },
 *            {
 *              "name": "Patch link",
 *              "url": "http://google.com"
 *            }
 *          ],
 *          "name": "CONTRIBUTION",
 *          "software": {
 *            "_id": "5e554cef840d2c56eb64161c",
 *            "timestamps": {
 *              "creation": "2020-02-25T16:35:59.119Z"
 *            },
 *            "schemaVersion": 1,
 *            "name": "OpenLDAP",
 *            "summary": "OpenLDAP",
 *            "description": "OpenLDAP",
 *            "externalLinks": [],
 *          },
 *          "author": {
 *            "_id": "5d9ce2696f254d5cf1d1d3fb",
 *            "user": "540da7521dadc2c713b377ac",
 *            "role": "expert",
 *            "email": "chamerling@linagora.com",
 *            "name": "Christophe HAMERLING",
 *            "phone": "",
 *            "type": "expert",
 *            "timestamps": {
 *              "createdAt": "2019-10-08T19:24:25.576Z"
 *            },
 *          },
 *          "type": "Backport",
 *          "version": "1",
 *          "fixedInVersion": "2",
 *          "deposedAt": "2020-03-25",
 *          "description": "zzd",
 *        },
 *        {
 *          "_id": 5,
 *          "timestamps": {
 *            "creation": "2020-03-13T08:24:57.283Z"
 *          },
 *          "status": {
 *            "develop": null,
 *            "reversed": null,
 *            "published": null,
 *            "integrated": null,
 *            "rejected": null
 *          },
 *          "links": [
 *            {
 *              "name": "Patch link",
 *              "url": "http://localhost"
 *            }
 *          ],
 *          "name": "AAA",
 *          "software": {
 *            "_id": "5e554cef840d2c56eb64161c",
 *            "timestamps": {
 *              "creation": "2020-02-25T16:35:59.119Z"
 *            },
 *            "name": "OpenLDAP",
 *            "summary": "OpenLDAP",
 *            "description": "OpenLDAP",
 *            "externalLinks": [],
 *          },
 *          "author": {
 *            "_id": "5d9dd9b4deed5a496dc36325",
 *            "user": "5d8b82a8c0787c7809d2f730",
 *            "role": "manager",
 *            "email": "roubraim@linagora.com",
 *            "name": "Rachid OUBRAIM",
 *            "phone": "",
 *            "type": "expert",
 *            "timestamps": {
 *              "createdAt": "2019-10-09T12:59:32.599Z"
 *            },
 *          },
 *          "type": "Correction",
 *          "version": "2",
 *          "fixedInVersion": "3",
 *          "deposedAt": "2020-03-31",
 *          "description": "dd",
 *        }
 *        ]
 */
