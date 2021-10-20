/**
 * @swagger
 * response:
 *  ticket:
 *    description: Ok with the ticket object
 *    schema:
 *      $ref: "#/definitions/ticket_content"
 *    examples:
 *      application/json:
 *        {
 *          "_id": 3,
 *          "timestamps": {
 *            "createdAt": "2020-03-10T16:05:01.179Z",
 *            "updatedAt": "2020-03-22T20:58:54.567Z"
 *          },
 *          "createdDuringBusinessHours": true,
 *          "participants": [],
 *          "relatedRequests": [],
 *          "relatedContributions": [
 *            {
 *              "_id": 2,
 *              "timestamps": {
 *                "creation": "2020-02-24T10:10:36.248Z"
 *              },
 *              "status": {
 *                "develop": null,
 *                "reversed": null,
 *                "published": null,
 *                "integrated": null,
 *                "rejected": null
 *              },
 *              "schemaVersion": 1,
 *              "links": [
 *                {
 *                  "name": "Patch link",
 *                  "url": "https://docs.mongodb.com/manual/tutorial/remove-documents/"
 *                }
 *              ],
 *              "name": "CONTRIBUTION 1",
 *              "software": "5e204fb4cdc2b21444f07bea",
 *              "author": "5e204fa9cdc2b21444f07be4",
 *              "version": "1",
 *              "type": "Evolution",
 *              "fixedInVersion": "2",
 *              "deposedAt": "2020-02-12",
 *              "description": "dd",
 *            },
 *            {
 *              "_id": 7,
 *              "timestamps": {
 *                "creation": "2020-03-22T20:53:57.721Z"
 *              },
 *              "status": {
 *                "develop": null,
 *                "reversed": null,
 *                "published": null,
 *                "integrated": null,
 *                "rejected": null
 *              },
 *              "schemaVersion": 1,
 *              "links": [
 *                {
 *                  "name": "Patch link",
 *                  "url": "http://localhost"
 *                }
 *              ],
 *              "name": "CONTRIBUTION 2",
 *              "software": "5e204fb4cdc2b21444f07bea",
 *              "author": "5e204fa9cdc2b21444f07be4",
 *              "type": "Backport",
 *              "version": "1",
 *              "fixedInVersion": "2",
 *              "deposedAt": "2020-03-16",
 *              "description": "hello",
 *            },
 *            {
 *              "_id": 8,
 *              "timestamps": {
 *                "creation": "2020-03-22T20:54:20.748Z"
 *              },
 *              "status": {
 *                "develop": null,
 *                "reversed": null,
 *                "published": null,
 *                "integrated": null,
 *                "rejected": null
 *              },
 *              "schemaVersion": 1,
 *              "links": [
 *                {
 *                  "name": "Patch link",
 *                  "url": "http://localhost"
 *                }
 *              ],
 *              "name": "CONTRIBUTION 3",
 *              "software": "5e204fb4cdc2b21444f07bea",
 *              "author": "5e204fa9cdc2b21444f07be4",
 *              "type": "Backport",
 *              "version": "111",
 *              "fixedInVersion": "22",
 *              "deposedAt": "2020-03-26",
 *              "description": "dzdzd",
 *            }
 *          ],
 *          "status": "new",
 *          "schemaVersion": 1,
 *          "title": "a",
 *          "contract": "5e4d4afbc6d0b30e8e0c489d",
 *          "type": "Information",
 *          "severity": "Major",
 *          "description": "<p>aa</p>",
 *          "software": {
 *            "software": {
 *              "_id": "5e204fb4cdc2b21444f07bea",
 *              "timestamps": {
 *                "creation": "2020-01-16T11:57:40.687Z"
 *              },
 *              "schemaVersion": 1,
 *              "name": "software1",
 *            },
 *            "critical": "critical",
 *            "technicalReferent": "",
 *            "os": "WIN",
 *            "version": "1",
 *            "SupportDate": {
 *              "start": "2020-02-19",
 *              "end": "2029-02-28"
 *            }
 *          },
 *          "author": {
 *            "id": "5e204f99cdc2b21444f07bdd",
 *            "name": "amy.wolsh@open-paas.org",
 *            "email": "amy.wolsh@open-paas.org",
 *            "type": "expert"
 *          },
 *          "beneficiary": {
 *            "id": "5e204f99cdc2b21444f07bdd",
 *            "name": "amy.wolsh@open-paas.org",
 *            "email": "amy.wolsh@open-paas.org",
 *            "type": "expert"
 *          },
 *          "events": [],
 *          "cns": {
 *            "supported": {
 *              "engagement": "P1DT2H",
 *              "workingHours": 9,
 *              "isNonBusinessHours": false,
 *              "elapsedMinutes": 4915,
 *              "suspendedMinutes": 0,
 *              "percentageElapsed": 744.7
 *            },
 *            "bypassed": {
 *              "engagement": "P2DT5H",
 *              "workingHours": 9,
 *              "isNonBusinessHours": false,
 *              "elapsedMinutes": 0,
 *              "suspendedMinutes": 0
 *            },
 *            "resolved": {
 *              "engagement": "P5DT5H",
 *              "workingHours": 9,
 *              "isNonBusinessHours": false,
 *              "elapsedMinutes": 0,
 *              "suspendedMinutes": 0,
 *              "percentageElapsed": 0
 *            }
 *          }
 *        }
 *  tickets:
 *    description: Ok with a list of tickets
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/ticket_content"
 *    examples:
 *      application/json:
 *        [
 *          {
 *            "_id": 3,
 *            "timestamps": {
 *              "createdAt": "2020-03-10T16:05:01.179Z",
 *              "updatedAt": "2020-03-22T20:58:54.567Z"
 *            },
 *            "createdDuringBusinessHours": true,
 *            "participants": [],
 *            "relatedRequests": [],
 *            "relatedContributions": [
 *              2,
 *              7,
 *              8
 *            ],
 *            "status": "new",
 *            "schemaVersion": 1,
 *            "title": "a",
 *            "contract": "5e4d4afbc6d0b30e8e0c489d",
 *            "type": "Information",
 *            "severity": "Major",
 *            "description": "<p>aa</p>",
 *            "software": {
 *              "software": {
 *                "_id": "5e204fb4cdc2b21444f07bea",
 *                "timestamps": {
 *                  "creation": "2020-01-16T11:57:40.687Z"
 *                },
 *                "schemaVersion": 1,
 *                "name": "software1",
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "",
 *              "os": "WIN",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2020-02-19",
 *                "end": "2029-02-28"
 *              }
 *            },
 *            "author": {
 *              "id": "5e204f99cdc2b21444f07bdd",
 *              "name": "amy.wolsh@open-paas.org",
 *              "email": "amy.wolsh@open-paas.org",
 *              "type": "expert"
 *            },
 *            "beneficiary": {
 *              "id": "5e204f99cdc2b21444f07bdd",
 *              "name": "amy.wolsh@open-paas.org",
 *              "email": "amy.wolsh@open-paas.org",
 *              "type": "expert"
 *            },
 *            "events": [],
 *            "cns": {
 *              "supported": {
 *                "engagement": "P1DT2H",
 *                "workingHours": 9,
 *                "isNonBusinessHours": false,
 *                "elapsedMinutes": 4915,
 *                "suspendedMinutes": 0,
 *                "percentageElapsed": 744.7
 *              },
 *              "bypassed": {
 *                "engagement": "P2DT5H",
 *                "workingHours": 9,
 *                "isNonBusinessHours": false,
 *                "elapsedMinutes": 0,
 *                "suspendedMinutes": 0
 *              },
 *              "resolved": {
 *                "engagement": "P5DT5H",
 *                "workingHours": 9,
 *                "isNonBusinessHours": false,
 *                "elapsedMinutes": 0,
 *                "suspendedMinutes": 0,
 *                "percentageElapsed": 0
 *              }
 *            }
 *          },
 *          {
 *            "_id": 2,
 *            "timestamps": {
 *              "createdAt": "2020-02-19T14:53:54.268Z",
 *              "updatedAt": "2020-02-21T14:56:47.504Z"
 *            },
 *            "createdDuringBusinessHours": true,
 *            "participants": [],
 *            "relatedRequests": [],
 *            "status": "new",
 *            "schemaVersion": 1,
 *            "title": "TICKET2",
 *            "contract": "5e4d4afbc6d0b30e8e0c489d",
 *            "type": "Anomaly",
 *            "severity": "Blocking",
 *            "description": "<p>ddd</p>",
 *            "software": {
 *              "software": {
 *                "_id": "5e204fb4cdc2b21444f07bea",
 *                "timestamps": {
 *                  "creation": "2020-01-16T11:57:40.687Z"
 *                },
 *                "schemaVersion": 1,
 *                "name": "software1",
 *                "__v": 0
 *              },
 *              "critical": "critical",
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "WIN",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2020-02-19",
 *                "end": "2029-02-28"
 *              }
 *            },
 *            "author": {
 *              "id": "5e20456914f52900b4c80c52",
 *              "name": "admin admin",
 *              "email": "admin@open-paas.org",
 *              "type": null
 *            },
 *            "beneficiary": {
 *              "id": "5e20456914f52900b4c80c52",
 *              "name": "admin admin",
 *              "email": "admin@open-paas.org",
 *              "type": null
 *            },
 *            "callNumber": "2",
 *            "meetingId": "2",
 *            "events": [],
 *            "relatedContributions": [],
 *            "cns": {
 *              "supported": {
 *                "engagement": "P2DT3H",
 *                "workingHours": 9,
 *                "isNonBusinessHours": false,
 *                "elapsedMinutes": 12547,
 *                "suspendedMinutes": 0,
 *                "percentageElapsed": 995.79
 *              },
 *              "bypassed": {
 *                "engagement": "P23DT2H",
 *                "workingHours": 9,
 *                "isNonBusinessHours": false,
 *                "elapsedMinutes": 0,
 *                "suspendedMinutes": 0
 *              },
 *              "resolved": {
 *                "engagement": "P5DT4H",
 *                "workingHours": 9,
 *                "isNonBusinessHours": false,
 *                "elapsedMinutes": 0,
 *                "suspendedMinutes": 0,
 *                "percentageElapsed": 0
 *              }
 *            }
 *          }
 *        ]
 */
