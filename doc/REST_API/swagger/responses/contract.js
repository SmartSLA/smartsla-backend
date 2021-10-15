/**
 * @swagger
 * response:
 *  contract:
 *    description: Ok with contribution object
 *    schema:
 *      $ref: "#/definitions/contract_content"
 *    examples:
 *      application/json:
 *        {
 *        "features": {
 *          "nonBusinessHours": false
 *        },
 *        "timestamps": {
 *          "createdAt": "2019-11-07T10:32:00.904Z",
 *          "updatedAt": "2019-11-07T10:32:00.904Z"
 *        },
 *        "status": true,
 *        "timezone": "Europe/Paris",
 *        "type": "",
 *        "_id": "5dc3f2a0e0fe8f04ec29d224",
 *        "name": "test contrat r",
 *        "client": "LINC",
 *        "contact": {
 *          "commercial": "",
 *          "technical": ""
 *        },
 *        "mailingList": {
 *          "internal": [],
 *          "external": []
 *        },
 *        "startDate": "2019-11-01T00:00:00.000Z",
 *        "endDate": "2019-11-16T00:00:00.000Z",
 *        "description": "",
 *        "humanResources": {
 *          "teams": [],
 *          "beneficiaries": []
 *        },
 *        "Engagements": {
 *          "critical": {
 *            "engagements": []
 *          },
 *          "sensible": {
 *            "engagements": []
 *          },
 *          "standard": {
 *            "engagements": []
 *          }
 *        },
 *        "clientId": "5d9dab8adeed5a496dc35e32",
 *        "software": [
 *          {
 *            "software": {
 *              "timestamps": {
 *                "creation": "2019-10-24T14:12:47.310Z"
 *              },
 *              "_id": "5db1b15f77e2cc0eb067a2cf",
 *              "name": "openpes",
 *              "externalLinks": []
 *            },
 *            "generic": false,
 *            "technicalReferent": "Renaud BOYER",
 *            "os": "1",
 *            "version": "10",
 *            "SupportDate": {
 *              "start": "",
 *              "end": ""
 *            },
 *            "critical": "sensible"
 *          },
 *          {
 *            "software": null,
 *            "SupportDate": {},
 *            "critical": "critical"
 *          },
 *          {
 *            "software": {
 *              "timestamps": {
 *                "creation": "2019-10-24T14:12:47.310Z"
 *              },
 *              "_id": "5db1b15f77e2cc0eb067a2cf",
 *              "name": "openpes",
 *              "externalLinks": []
 *            },
 *            "generic": false,
 *            "technicalReferent": "Rachid OUBRAIM",
 *            "os": "1",
 *            "version": "12",
 *            "SupportDate": {
 *              "start": "",
 *              "end": ""
 *            },
 *            "critical": "standard"
 *          },
 *          {
 *            "SupportDate": {
 *              "end": "",
 *              "start": ""
 *            },
 *            "version": "1",
 *            "os": "1",
 *            "technicalReferent": "Rachid OUBRAIM",
 *            "generic": false,
 *            "software": {
 *              "timestamps": {
 *                "creation": "2019-10-24T14:12:47.310Z"
 *              },
 *              "_id": "5db1b15f77e2cc0eb067a2cf",
 *              "name": "openpes",
 *              "externalLinks": []
 *            },
 *            "critical": "sensible"
 *          }
 *        ],
 *        "externalLinks": []
 *        }
 *  contracts:
 *    description: OK with contracts list
 *    schema:
 *      type: array
 *      items:
 *        $ref: "#/definitions/contract_content"
 *    examples:
 *      application/json:
 *        [
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-07T10:32:00.904Z",
 *            "updatedAt": "2019-11-07T10:32:00.904Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5dc3f2a0e0fe8f04ec29d224",
 *          "name": "test contrat r",
 *          "client": "LINC",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-01T00:00:00.000Z",
 *          "endDate": "2019-11-16T00:00:00.000Z",
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5d9dab8adeed5a496dc35e32",
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "1",
 *              "version": "10",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              },
 *              "critical": "sensible"
 *            },
 *            {
 *              "software": null,
 *              "SupportDate": {},
 *              "critical": "critical"
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Rachid OUBRAIM",
 *              "os": "1",
 *              "version": "12",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              },
 *              "critical": "standard"
 *            },
 *            {
 *              "SupportDate": {
 *                "end": "",
 *                "start": ""
 *              },
 *              "version": "1",
 *              "os": "1",
 *              "technicalReferent": "Rachid OUBRAIM",
 *              "generic": false,
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "critical": "sensible"
 *            }
 *          ],
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-10-31T10:46:25.328Z",
 *            "updatedAt": "2019-10-31T10:46:25.328Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "credit",
 *          "schemaVersion": 1,
 *          "_id": "5dbabb818c25fe51f61251bd",
 *          "name": "contract3",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-10-01T00:00:00.000Z",
 *          "endDate": "2019-10-26T00:00:00.000Z",
 *          "description": "contract3",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5ddfa6ec5b829a7ba721af47",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "Ismaeil ABOULJAMAL",
 *              "os": "linuxe",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2019-10-01",
 *                "end": "2019-10-12"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Ismaeil ABOULJAMAL",
 *              "os": "WIN",
 *              "version": "2",
 *              "SupportDate": {
 *                "start": "2019-11-14",
 *                "end": "2019-11-29"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Harold GOGUELIN",
 *              "os": "WIN",
 *              "version": "3",
 *              "SupportDate": {
 *                "start": "2019-11-14",
 *                "end": "2019-11-29"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "SupportDate": {
 *                "end": "2019-11-15",
 *                "start": "2019-11-01"
 *              },
 *              "version": "1",
 *              "os": "Linux",
 *              "technicalReferent": "Christophe HAMERLING",
 *              "generic": "yes",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              }
 *            }
 *          ],
 *          "__v": 0,
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-07T14:06:26.754Z",
 *            "updatedAt": "2019-11-07T14:06:26.754Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "credit",
 *          "_id": "5dc424e2e0fe8f04ec29d231",
 *          "name": "Contract 001",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-01T00:00:00.000Z",
 *          "endDate": "2019-11-09T00:00:00.000Z",
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df06798e29925292aefd02c",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5dd264eceb518b3414ea842a",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "software": [
 *            {
 *              "critical": "sensible",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Ismaeil ABOULJAMAL",
 *              "os": "100",
 *              "version": "10",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-10-23T16:49:49.369Z",
 *            "updatedAt": "2019-10-23T16:49:49.369Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "_id": "5db084ad77e2cc0eb0679e4c",
 *          "name": "Contrat Dev",
 *          "client": "Client 2019 10 22",
 *          "contact": {
 *            "commercial": "Bernard Tapie",
 *            "technical": "Jérome HERLEDAN"
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-10-01T00:00:00.000Z",
 *          "endDate": "2020-04-30T00:00:00.000Z",
 *          "description": "Contrat de test",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5de12249d632125847d36aa1",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT3H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5de12249d632125847d36aa0",
 *                  "supported": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "PT5H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT5H",
 *                    "nonBusinessHours": "PT6H"
 *                  }
 *                },
 *                {
 *                  "_id": "5de12249d632125847d36a9f",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT3H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "PT4H"
 *                  }
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5de1227ad632125847d36abd",
 *                  "supported": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "PT5H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Minor",

 *                  "bypassed": {
 *                    "businessHours": "PT5H",
 *                    "nonBusinessHours": "PT6H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT6H",
 *                    "nonBusinessHours": "PT7H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5de12297d632125847d36ac3",
 *                  "supported": {
 *                    "businessHours": "PT5H",
 *                    "nonBusinessHours": "PT6H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "None",
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P1D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5de520e09710313bc6ee48e4",
 *                  "supported": {
 *                    "businessHours": "P45DT1H",
 *                    "nonBusinessHours": "P45DT1H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "P45DT1H",
 *                    "nonBusinessHours": "P45DT1H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P45DT1H",
 *                    "nonBusinessHours": "P45DT1H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "clientId": "5daf287d636caf65fea1b48b",
 *          "software": [
 *            {
 *              "critical": "sensible",
 *              "SupportDate": {
 *                "end": "2020-11-30",
 *                "start": "2019-10-01"
 *              },
 *              "version": "1",
 *              "os": "Linuxe",
 *              "technicalReferent": "Aiman R'KYEK",
 *              "generic": "yes",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "externalLinks": []
 *              }
 *            },
 *            {
 *              "critical": "standard",
 *              "SupportDate": {
 *                "end": "2019-10-12",
 *                "start": "2019-10-03"
 *              },
 *              "version": "2",
 *              "os": "fenêtres 10",
 *              "technicalReferent": "Harold GOGUELIN",
 *              "generic": "yes",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "SupportDate": {
 *                "end": "2019-10-12",
 *                "start": "2019-10-03"
 *              },
 *              "version": "2",
 *              "os": "fenêtres 10",
 *              "technicalReferent": "Harold GOGUELIN",
 *              "generic": "yes",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              }
 *            },
 *            {
 *              "critical": "standard",
 *              "SupportDate": {
 *                "end": "2019-10-12",
 *                "start": "2019-10-03"
 *              },
 *              "version": "2",
 *              "os": "fenêtres 10",
 *              "technicalReferent": "Harold GOGUELIN",
 *              "generic": "yes",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "SupportDate": {
 *                "end": "2019-10-31",
 *                "start": "2019-10-01"
 *              },
 *              "version": "1",
 *              "os": "1",
 *              "technicalReferent": "Harold GOGUELIN",
 *              "generic": "yes",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Christophe HAMERLING",
 *              "os": "1",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2019-10-01",
 *                "end": "2019-10-31"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "Rachid OUBRAIM",
 *              "os": "1",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2019-10-01",
 *                "end": "2019-10-01"
 *              }
 *            }
 *          ],
 *          "__v": 0,
 *          "businessHours": {
 *            "start": "9",
 *            "end": "18"
 *          },
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-10-23T17:01:40.140Z",
 *            "updatedAt": "2019-10-23T17:01:40.140Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5db0877477e2cc0eb0679e62",
 *          "name": "Contrat 2",
 *          "client": "Client 2019 10 22",
 *          "contact": {
 *            "commercial": "Bernard Tapie",
 *            "technical": "Jérome HERLEDAN"
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-10-01T00:00:00.000Z",
 *          "endDate": "2019-12-20T00:00:00.000Z",
 *          "description": "Ma description",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5dc060d225c0406ac3cba372",
 *                  "description": "",
 *                  "severity": "Major",
 *                  "request": "Anomaly"
 *                },
 *                {
 *                  "_id": "5dcbd87f76aec77d3d6b6d08",
 *                  "description": "",
 *                  "severity": "Blocking",
 *                  "request": "Anomaly"
 *                },
 *                {
 *                  "_id": "5dcc3e5c53f0c0570f7260d7",
 *                  "request": "Ra",
 *                  "severity": "Major",
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5dc05df625c0406ac3cba36e",
 *                  "description": "",
 *                  "severity": "Minor",
 *                  "request": "Anomaly"
 *                },
 *                {
 *                  "_id": "5dc1381c25c0406ac3cba73c",
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5daf287d636caf65fea1b48b",
 *          "software": [
 *            {
 *              "critical": "sensible",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "Khaled FERJANI",
 *              "os": "20000",
 *              "version": "10000",
 *              "SupportDate": {
 *                "start": "2019-10-01",
 *                "end": "2019-10-06"
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              },
 *              "generic": false,
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "110",
 *              "version": "10",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "critical": "standard",
 *              "software": null,
 *              "SupportDate": {}
 *            },
 *            {
 *              "critical": "standard",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "0",
 *              "version": "0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "__v": 0,
 *          "businessHours": {
 *            "start": "8",
 *            "end": "19"
 *          },
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "updatedAt": "2019-11-21T08:02:23.797Z",
 *            "createdAt": "2019-11-21T08:02:23.797Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5dd6448f54206c74131aefce",
 *          "name": "Ha Contract 02",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-20T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "software": [],
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "updatedAt": "2019-11-21T08:11:48.596Z",
 *            "createdAt": "2019-11-21T08:11:48.596Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5dd646c454206c74131aeff2",
 *          "name": "Ha contract 03",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-20T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "software": [],
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-05T07:58:08.766Z",
 *            "updatedAt": "2019-12-05T07:58:08.766Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5de8b8909710313bc6ee70aa",
 *          "name": "jj",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-04T00:00:00.000Z",
 *          "endDate": "2020-01-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-04T07:57:25.587Z",
 *            "updatedAt": "2019-12-04T07:57:25.588Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5de766e59710313bc6ee568d",
 *          "name": "Ha contract",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-03T00:00:00.000Z",
 *          "endDate": "2020-01-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "standard",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "Android",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "updatedAt": "2019-11-27T10:16:42.743Z",
 *            "createdAt": "2019-11-27T10:16:42.743Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5dde4d0a52f4aa7101997760",
 *          "name": "Support Logiciel libres 300 entrées",
 *          "client": "Client Valentin",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-10T00:00:00.000Z",
 *          "endDate": "2019-11-30T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "5",
 *            "end": "23"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5ddbd5e70ec7db316db90868",
 *          "software": [],
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "updatedAt": "2019-11-27T10:20:01.089Z",
 *            "createdAt": "2019-11-27T10:20:01.089Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5dde4dd152f4aa7101997762",
 *          "name": "nouveau contract ",
 *          "client": "Fabien",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-26T00:00:00.000Z",
 *          "endDate": "2019-11-28T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "13"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "clientId": "5dd7e3957f867f32f63fc7f1",
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "1",
 *              "version": "2",
 *              "SupportDate": {
 *                "start": "2019-11-27",
 *                "end": "2019-11-29"
 *              }
 *            }
 *          ],
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-25T13:24:09.666Z",
 *            "updatedAt": "2019-11-25T13:24:09.666Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5ddbd5f90ec7db316db9086a",
 *          "name": "Contrat Valentin",
 *          "client": "Client Valentin",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-03T00:00:00.000Z",
 *          "endDate": "2020-03-20T00:00:00.000Z",
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5de13a1d5d08c40d266c35b3",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "PT12H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "clientId": "5ddbd5e70ec7db316db90868",
 *          "software": [
 *            {
 *              "critical": "standard",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Valentin",
 *              "version": "1.1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "__v": 0,
 *          "businessHours": {
 *            "start": "8",
 *            "end": "16"
 *          },
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-28T10:42:56.959Z",
 *            "updatedAt": "2019-11-28T10:42:56.959Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5ddfa4b05b829a7ba721aee3",
 *          "name": "Contrat oub",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-03T00:00:00.000Z",
 *          "endDate": "2019-11-30T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5de008601587462690f08c65",
 *                  "supported": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT6H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5dea8cb3e29925292aefa00a",
 *                  "supported": {
 *                    "businessHours": "P10DT20H",
 *                    "nonBusinessHours": "P30DT40H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P50DT60H",
 *                    "nonBusinessHours": "P70DT80H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P90DT90H",
 *                    "nonBusinessHours": "P90DT60H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-20T07:06:38.388Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dd4e5fe05bcda6475cc59e8",
 *                "name": "Thunderbird",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Rachid OUBRAIM",
 *              "os": "CentOS",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-28T17:50:33.490Z",
 *            "updatedAt": "2019-11-28T17:50:33.491Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5de008e91587462690f08ca0",
 *          "name": "new new fabien",
 *          "client": "Fabien",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-27T00:00:00.000Z",
 *          "endDate": "2019-11-30T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "9",
 *            "end": "11"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5de009911587462690f08cba",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT6H",
 *                    "nonBusinessHours": "P1D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5de521d89710313bc6ee4912",
 *                  "supported": {
 *                    "businessHours": "P50DT2H",
 *                    "nonBusinessHours": "P50DT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P55DT3H",
 *                    "nonBusinessHours": "P55DT3H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P60DT4H",
 *                    "nonBusinessHours": "P60DT4H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5de5241e9710313bc6ee4964",
 *                  "supported": {
 *                    "businessHours": "P50D",
 *                    "nonBusinessHours": "P40D"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "P30DT1H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P41D",
 *                    "nonBusinessHours": "P30DT50H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "2",
 *              "version": "2.3",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "critical": "sensible",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-20T07:06:47.646Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dd4e60705bcda6475cc59ea",
 *                "name": "James",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "2",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2019-12-03",
 *                "end": "2019-12-04"
 *              }
 *            }
 *          ],
 *          "clientId": "5dd7e3957f867f32f63fc7f1",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-29T09:21:35.864Z",
 *            "updatedAt": "2019-11-29T09:21:35.864Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5de0e31f32ed44158a7d1bc7",
 *          "name": "New Contract 2909",
 *          "client": "LINC",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-29T00:00:00.000Z",
 *          "endDate": "2020-11-26T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "9",
 *            "end": "17"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5de0e38032ed44158a7d1bde",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-20T07:06:38.388Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dd4e5fe05bcda6475cc59e8",
 *                "name": "Thunderbird",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Rachid OUBRAIM",
 *              "os": "Liux",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-27T16:01:04.199Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dde9dc01571543e15bc0cd2",
 *                "name": "PgSQL",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "group": "Sécurité SGBD"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "L",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5d9dab8adeed5a496dc35e32",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-29T09:42:18.364Z",
 *            "updatedAt": "2019-11-29T09:42:18.364Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5de0e7fa32ed44158a7d1d9e",
 *          "name": "contract Fabien 24/7",
 *          "client": "Fabien",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-28T00:00:00.000Z",
 *          "endDate": "2019-11-30T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "7",
 *            "end": "14"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5de0e86932ed44158a7d1dad",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT3H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5de9150ae29925292aef8b94",
 *                  "supported": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "PT6H",
 *                    "nonBusinessHours": "PT6H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "2",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2020-01-10",
 *                "end": "2020-01-28"
 *              }
 *            }
 *          ],
 *          "clientId": "5dd7e3957f867f32f63fc7f1",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-29T14:34:09.112Z",
 *            "updatedAt": "2019-11-29T14:34:09.112Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5de12c61d632125847d36ffc",
 *          "name": "leacontrat",
 *          "client": "lea",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-27T00:00:00.000Z",
 *          "endDate": "2019-11-30T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "07",
 *            "end": "14"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5de12d88d632125847d37082",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "PT6H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-20T07:06:38.388Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dd4e5fe05bcda6475cc59e8",
 *                "name": "Thunderbird",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "linux",
 *              "version": "10",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5de12b3fd632125847d36fa6",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-11-22T13:33:57.161Z",
 *            "updatedAt": "2019-11-22T13:33:57.161Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5dd7e3c57f867f32f63fc7f3",
 *          "name": "contract Fabien",
 *          "client": "Fabien",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-11-21T00:00:00.000Z",
 *          "endDate": "2020-04-16T00:00:00.000Z",
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e7da6f381e3d43b645ebc7f",
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P40D",
 *                    "nonBusinessHours": "P40D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5de7b3c39710313bc6ee608b",
 *                  "supported": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e5cdf4c163cd0255961082e",
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "clientId": "5dd7e3957f867f32f63fc7f1",
 *          "software": [
 *            {
 *              "critical": "standard",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-20T07:06:47.646Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dd4e60705bcda6475cc59ea",
 *                "name": "James",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "3",
 *              "SupportDate": {
 *                "start": "",
 *                "end": "2021-01-10"
 *              }
 *            }
 *          ],
 *          "__v": 0,
 *          "businessHours": {
 *            "start": "9",
 *            "end": "18"
 *          },
 *          "externalLinks": [
 *            {
 *              "name": "ttps://www.linshare.org/",
 *              "url": "https://www.linshare.org/"
 *            }
 *          ]
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T08:03:24.142Z",
 *            "updatedAt": "2019-12-11T08:03:24.142Z"
 *          },
 *          "status": false,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df0a2cce4c25b4cc219accb",
 *          "name": "Contract 1112",
 *          "client": "Ha New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-11T00:00:00.000Z",
 *          "endDate": "2019-12-12T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5df09fa8e4c25b4cc219ac1c",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T14:51:21.255Z",
 *            "updatedAt": "2019-12-11T14:51:21.255Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df10269e4c25b4cc219b11c",
 *          "name": "MCO OpenPaaS avec Dashboard",
 *          "client": "Client 2019 10 22",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-12T00:00:00.000Z",
 *          "endDate": "2019-12-27T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5daf287d636caf65fea1b48b",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-10T15:17:00.145Z",
 *            "updatedAt": "2019-12-10T15:17:00.145Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5defb6ece29925292aefc962",
 *          "name": "SHORT CONTRACT",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-02T00:00:00.000Z",
 *          "endDate": "2019-12-28T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "1",
 *            "end": "2"
 *          },
 *          "description": "testing NBH",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5defb72de29925292aefc97e",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P1DT2H",
 *                    "nonBusinessHours": "P1DT2H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P3DT4H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5DT6H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              },
 *              "generic": "yes",
 *              "technicalReferent": "Wajdi GHARBI",
 *              "os": "2",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2019-12-02",
 *                "end": "2019-12-18"
 *              }
 *            }
 *          ],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T07:51:19.982Z",
 *            "updatedAt": "2019-12-11T07:51:19.982Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df09ff7e4c25b4cc219ac20",
 *          "name": "contract 20191211",
 *          "client": "Ha New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-09T00:00:00.000Z",
 *          "endDate": "2019-12-10T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df0a070e4c25b4cc219ac33",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-27T16:01:04.199Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dde9dc01571543e15bc0cd2",
 *                "name": "PgSQL",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "group": "Sécurité SGBD"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-27T16:01:04.199Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dde9dc01571543e15bc0cd2",
 *                "name": "PgSQL",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "group": "Sécurité SGBD"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "2.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "credits": 1,
 *          "clientId": "5df09fa8e4c25b4cc219ac1c",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": null
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-03-11T15:43:37.733Z",
 *            "updatedAt": "2020-03-11T15:43:37.733Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5e6907292891b92465cb1fba",
 *          "name": "TAO plateforme editing",
 *          "client": "MPEN",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-03-11T00:00:00.000Z",
 *          "endDate": "2021-03-11T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "Support information utilisation de TAO editing\nHebergement de la plateforme ",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2020-03-11T15:45:02.533Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5e69077e2891b92465cb1fbc",
 *                "name": "TAO platforme",
 *                "summary": "Plateforme d'évaluation assistée par ordinateur des connaissances des élèves ",
 *                "licence": "GNU General Public License (GPL)",
 *                "technology": "PHP",
 *                "externalLinks": [],
 *                "__v": 0
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "1.1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": null
 *              }
 *            }
 *          ],
 *          "externalLinks": [],
 *          "clientId": "5e69068b2891b92465cb1fb8",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-03-25T11:11:31.526Z",
 *            "updatedAt": "2020-03-25T11:11:31.526Z"
 *          },
 *          "status": true,
 *          "timezone": "Pacific/Niue",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5e7b3c6323298131dd703335",
 *          "name": "a",
 *          "client": "MPEN",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-03-01T00:00:00.000Z",
 *          "endDate": "2020-03-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "17"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "externalLinks": [],
 *          "clientId": "5e69068b2891b92465cb1fb8",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-09T09:44:57.217Z",
 *            "updatedAt": "2019-12-09T09:44:57.217Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5dee1799e29925292aefaadd",
 *          "name": "Contract oubra",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-01T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5dee1931e29925292aefab37",
 *                  "supported": {
 *                    "businessHours": "P10DT20H",
 *                    "nonBusinessHours": "P31DT16H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P31DT15H",
 *                    "nonBusinessHours": "P11DT16H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P30DT16H",
 *                    "nonBusinessHours": "P20DT10H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5dee2043e29925292aefae28",
 *                  "supported": {
 *                    "businessHours": "P10DT20H",
 *                    "nonBusinessHours": "P31DT16H"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P20D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P4DT5H",
 *                    "nonBusinessHours": "P6DT7H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5dee2d27e29925292aefb033",
 *                  "supported": {
 *                    "businessHours": "P40DT4H",
 *                    "nonBusinessHours": "P31DT16H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P40DT5H",
 *                    "nonBusinessHours": "P11DT6H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P80DT2H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5dee4a39e29925292aefb1d7",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P31DT16H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P40D",
 *                    "nonBusinessHours": "P3D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P50D",
 *                    "nonBusinessHours": "P4D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              },
 *              "generic": false,
 *              "technicalReferent": "Khaled FERJANI",
 *              "os": "Linux",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-05T03:14:05.896Z",
 *            "updatedAt": "2019-12-05T03:14:05.896Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5de875fd9710313bc6ee6ed8",
 *          "name": "ha contract full",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-31T00:00:00.000Z",
 *          "endDate": "2020-10-03T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5dea209be29925292aef97e5",
 *                  "supported": {
 *                    "businessHours": "P2DT4H",
 *                    "nonBusinessHours": "P2DT4H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Blocking",
 *                  "bypassed": {
 *                    "businessHours": "P2DT4H",
 *                    "nonBusinessHours": "P2DT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2DT4H",
 *                    "nonBusinessHours": "P2DT4H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5def081ee29925292aefbf22",
 *                  "supported": {
 *                    "businessHours": "P5DT2H",
 *                    "nonBusinessHours": "P5DT2H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "P5DT2H",
 *                    "nonBusinessHours": "P5DT2H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5DT2H",
 *                    "nonBusinessHours": "P5DT2H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5def0a39e29925292aefbf4b",
 *                  "supported": {
 *                    "businessHours": "P5DT2H",
 *                    "nonBusinessHours": "P5DT2H"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P5DT5H",
 *                    "nonBusinessHours": "P5DT5H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5DT5H",
 *                    "nonBusinessHours": "P5DT5H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5def0a39e29925292aefbf4a",
 *                  "supported": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "request": "Information",
 *                  "severity": "None",
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  }
 *                },
 *                {
 *                  "_id": "5def0a39e29925292aefbf49",
 *                  "supported": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "P5DT5H",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P5D"
 *                  }
 *                },
 *                {
 *                  "_id": "5def0a39e29925292aefbf48",
 *                  "supported": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  }
 *                },
 *                {
 *                  "_id": "5def0a39e29925292aefbf47",
 *                  "supported": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P4D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "bypassed": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P4DT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P4D"
 *                  }
 *                },
 *                {
 *                  "_id": "5def0a39e29925292aefbf46",
 *                  "supported": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "None",
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P10D"
 *                  }
 *                },
 *                {
 *                  "_id": "5e7b14c723298131dd702dbe",
 *                  "request": "new type",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7b14c723298131dd702dbd",
 *                  "request": "new new",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P1D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P1D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P1D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5de877209710313bc6ee6f23",
 *                  "supported": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P6D"
 *                  },
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P6D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P6D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5def0e43e29925292aefbf90",
 *                  "supported": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P4D"
 *                  },
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "bypassed": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "P4D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P4D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5df7270457a4ad7fc872b5bc",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5de877419710313bc6ee6f27",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "request": "Other",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5df099dd6d936f355583ad95",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "PT2H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c587d3687003605f58df0",
 *                  "request": "Administration",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "standard",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "critical": "sensible",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "2.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "3.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T08:35:18.046Z",
 *            "updatedAt": "2019-12-11T08:35:18.046Z"
 *          },
 *          "status": false,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df0aa46e4c25b4cc219ad35",
 *          "name": "inactive contract",
 *          "client": "Ha New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-10T00:00:00.000Z",
 *          "endDate": "2020-01-10T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5df0aaa3e4c25b4cc219ad5f",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT8H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT8H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT8H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "standard",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-27T16:01:04.199Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dde9dc01571543e15bc0cd2",
 *                "name": "PgSQL",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "group": "Sécurité SGBD"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5df09fa8e4c25b4cc219ac1c",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T14:53:50.038Z",
 *            "updatedAt": "2019-12-11T14:53:50.038Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df102fee4c25b4cc219b137",
 *          "name": "TCompany MCO Site web",
 *          "client": "lea",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-12T00:00:00.000Z",
 *          "endDate": "2019-12-27T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "20"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5de12b3fd632125847d36fa6",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T14:53:50.069Z",
 *            "updatedAt": "2019-12-11T14:53:50.069Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df102fee4c25b4cc219b138",
 *          "name": "TCompagnyDuBonheur Maintenance applicative solution Jitsi",
 *          "client": "lea",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-12T00:00:00.000Z",
 *          "endDate": "2019-12-27T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "20"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5de12b3fd632125847d36fa6",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T14:53:50.157Z",
 *            "updatedAt": "2019-12-11T14:53:50.158Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df102fee4c25b4cc219b13a",
 *          "name": "TCompanyForYou SLL OpenPaaS",
 *          "client": "lea",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-12T00:00:00.000Z",
 *          "endDate": "2019-12-27T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "20"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5de12b3fd632125847d36fa6",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-11T14:57:12.511Z",
 *            "updatedAt": "2019-12-11T14:57:12.511Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df103c8e4c25b4cc219b16f",
 *          "name": "TSociete Support Logiciel libres Linshare OpenLDAP LemonLDAP",
 *          "client": "Ha New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-12T00:00:00.000Z",
 *          "endDate": "2019-12-20T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5df09fa8e4c25b4cc219ac1c",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-12T16:35:02.142Z",
 *            "updatedAt": "2019-12-12T16:35:02.142Z"
 *          },
 *          "status": false,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df26c36d602c67b4d8124a4",
 *          "name": "Not active contract",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-13T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "21"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-12T16:52:05.840Z",
 *            "updatedAt": "2019-12-12T16:52:05.840Z"
 *          },
 *          "status": false,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df27035d602c67b4d8125ab",
 *          "name": "A NON ACTIVE",
 *          "client": "Client Valentin",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-19T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "3",
 *            "end": "4"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5ddbd5e70ec7db316db90868",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-12T16:52:05.865Z",
 *            "updatedAt": "2019-12-12T16:52:05.865Z"
 *          },
 *          "status": false,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df27035d602c67b4d8125ac",
 *          "name": "A NON ACTIVE",
 *          "client": "Client Valentin",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-19T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "3",
 *            "end": "4"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5ddbd5e70ec7db316db90868",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-12T16:53:22.875Z",
 *            "updatedAt": "2019-12-12T16:53:22.875Z"
 *          },
 *          "status": false,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df27082d602c67b4d8125e3",
 *          "name": "Disabled",
 *          "client": "Fabien",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-19T00:00:00.000Z",
 *          "endDate": "2019-12-19T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "2",
 *            "end": "6"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5dd7e3957f867f32f63fc7f1",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-13T10:01:57.563Z",
 *            "updatedAt": "2019-12-13T10:01:57.563Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df3619561282d7007097f87",
 *          "name": "new contract",
 *          "client": "New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-12T00:00:00.000Z",
 *          "endDate": "2020-01-17T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "clientId": "5df3617161282d7007097f6b",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-13T13:41:30.349Z",
 *            "updatedAt": "2019-12-13T13:41:30.349Z"
 *          },
 *          "status": true,
 *          "timezone": "Pacific/Niue",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df3950a57a4ad7fc872a918",
 *          "name": "Contract timzeone utc-11",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-08T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df3957157a4ad7fc872a937",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT2H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "PT3H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Linux",
 *              "version": "1.12",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-16T06:51:45.548Z",
 *            "updatedAt": "2019-12-16T06:51:45.548Z"
 *          },
 *          "status": true,
 *          "timezone": "Asia/Ho_Chi_Minh",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df7298157a4ad7fc872b611",
 *          "name": "contract with timezone",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-15T00:00:00.000Z",
 *          "endDate": "2020-01-03T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df72c4257a4ad7fc872b624",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5df72cd057a4ad7fc872b640",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P2DT4H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P2DT5H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2DT3H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Ubuntu",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-16T08:21:14.682Z",
 *            "updatedAt": "2019-12-16T08:21:14.682Z"
 *          },
 *          "status": true,
 *          "timezone": "Asia/Ho_Chi_Minh",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df73e7a57a4ad7fc872b769",
 *          "name": "aanother contract with timezone",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-15T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "15"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df73eb957a4ad7fc872b77a",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-27T16:01:04.199Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dde9dc01571543e15bc0cd2",
 *                "name": "PgSQL",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "group": "Sécurité SGBD"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "a",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-16T08:28:49.178Z",
 *            "updatedAt": "2019-12-16T08:28:49.178Z"
 *          },
 *          "status": true,
 *          "timezone": "Asia/Seoul",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5df7404157a4ad7fc872b7b0",
 *          "name": "contract in French timezone",
 *          "client": "Ha Client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-15T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "10"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df7407257a4ad7fc872b7c1",
 *                  "request": "Information",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "a",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5dd4af93a86e5a1a25a61c40",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": null
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-16T09:41:43.402Z",
 *            "updatedAt": "2019-12-16T09:41:43.402Z"
 *          },
 *          "status": true,
 *          "timezone": "Asia/Jakarta",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df7515757a4ad7fc872b8de",
 *          "name": "oubraim tz Vietnamese",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-01T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "15"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df754c157a4ad7fc872b980",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P3D",
 *                    "nonBusinessHours": "P3D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "Linux",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-16T09:37:56.093Z",
 *            "updatedAt": "2019-12-16T09:37:56.093Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5df7507457a4ad7fc872b8c2",
 *          "name": "oubraim tz paris",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-01T00:00:00.000Z",
 *          "endDate": "2019-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5df7581357a4ad7fc872ba9c",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P4D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P6D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "critical": "critical",
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "generic": false,
 *              "technicalReferent": "Renaud BOYER",
 *              "os": "1",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-01-15T17:39:59.532Z",
 *            "updatedAt": "2020-01-15T17:39:59.532Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "credit",
 *          "schemaVersion": 1,
 *          "_id": "5e1f4e6f44e2df599b659824",
 *          "name": "A 2 credits contract",
 *          "client": "New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-01-01T00:00:00.000Z",
 *          "endDate": "2020-01-24T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "test",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e1f4e9d44e2df599b65984f",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P11DT11H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2020-03-12T13:00:30.188Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5e6a326eec86ec43d721a41a",
 *                "name": "Libre Office",
 *                "externalLinks": [],
 *                "__v": 0
 *              },
 *              "critical": "standard",
 *              "technicalReferent": "",
 *              "os": "ios",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "Harold GOGUELIN",
 *              "os": "reee",
 *              "version": "2",
 *              "SupportDate": {
 *                "start": "2020-01-01",
 *                "end": "2020-01-15"
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "critical": "sensible",
 *              "technicalReferent": "",
 *              "os": "reeee",
 *              "version": "3",
 *              "SupportDate": {
 *                "start": "2020-01-30",
 *                "end": "2020-01-31"
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "critical": "sensible",
 *              "technicalReferent": "",
 *              "os": "eee",
 *              "version": "eee",
 *              "SupportDate": {
 *                "start": "2020-02-13",
 *                "end": "2020-02-20"
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2020-03-11T15:45:02.533Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5e69077e2891b92465cb1fbc",
 *                "name": "TAO platforme",
 *                "summary": "Plateforme d'évaluation assistée par ordinateur des connaissances des élèves ",
 *                "licence": "GNU General Public License (GPL)",
 *                "technology": "PHP",
 *                "externalLinks": [],
 *                "__v": 0
 *              },
 *              "critical": "standard",
 *              "technicalReferent": "",
 *              "os": "â",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "credits": 2,
 *          "externalLinks": [
 *            {
 *              "name": "test",
 *              "url": "https://www.linshare.org/"
 *            },
 *            {
 *              "name": "test2",
 *              "url": "https://www.linshare.org/"
 *            }
 *          ],
 *          "clientId": "5df3617161282d7007097f6b",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-01-08T10:58:14.931Z",
 *            "updatedAt": "2020-01-08T10:58:14.931Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "credit",
 *          "schemaVersion": 1,
 *          "_id": "5e15b5c6b3855f7589423c4f",
 *          "name": "Little contract",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-01-01T00:00:00.000Z",
 *          "endDate": "2020-05-01T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e15b62cb3855f7589423c60",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "critical": "critical",
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "2",
 *              "version": "2",
 *              "SupportDate": {
 *                "start": "2020-01-01",
 *                "end": "2020-06-05"
 *              }
 *            }
 *          ],
 *          "credits": 1,
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": []
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2019-12-17T10:50:15.243Z",
 *            "updatedAt": "2019-12-17T10:50:15.243Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "credit",
 *          "schemaVersion": 1,
 *          "_id": "5df8b2e781a2da6f63bed2c9",
 *          "name": "Contract EDF 2020",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2019-12-17T00:00:00.000Z",
 *          "endDate": "2020-12-05T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5dfba8ef7bb1025600bf85e9",
 *                  "request": "Administration",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "P1DT2H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P3DT4H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5DT6H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5df8b3f181a2da6f63bed328",
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "P1DT3H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P2DT5H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5DT10H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5dfba87a7bb1025600bf85b3",
 *                  "supported": {
 *                    "businessHours": "P1DT3H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "request": "Administration",
 *                  "severity": "Minor",
 *                  "bypassed": {
 *                    "businessHours": "P2DT5H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P4DT12H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e3c3f4964fea431a7e0d62b",
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-11-20T07:06:38.388Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5dd4e5fe05bcda6475cc59e8",
 *                "name": "Thunderbird",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "critical": "sensible",
 *              "generic": "yes",
 *              "technicalReferent": "Harold GOGUELIN",
 *              "os": "Linux",
 *              "version": "22",
 *              "SupportDate": {
 *                "start": "2019-12-17",
 *                "end": "2020-12-10"
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "critical": "critical",
 *              "generic": "yes",
 *              "technicalReferent": "",
 *              "os": "ubuntu",
 *              "version": "12",
 *              "SupportDate": {
 *                "start": "2019-12-20",
 *                "end": "2019-12-28"
 *              }
 *            }
 *          ],
 *          "credits": 20,
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0,
 *          "externalLinks": [
 *            {
 *              "name": "aaa",
 *              "url": "a.com"
 *            }
 *          ]
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-01-22T14:33:14.566Z",
 *            "updatedAt": "2020-01-22T14:33:14.566Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5e285d2ae74ec56cf0cf3b23",
 *          "name": "Support logiciel libre 40 VLA",
 *          "client": "New client",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-01-21T00:00:00.000Z",
 *          "endDate": "2021-01-23T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "9",
 *            "end": "10"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e1f4e9d44e2df599b65984f",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P11DT11H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1DT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-12-13T10:02:19.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5df361ab61282d7007097f89",
 *                "name": "LemonLDAP",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "summary": "LemonLDAP"
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "",
 *              "os": "reee",
 *              "version": "2",
 *              "SupportDate": {
 *                "start": "2020-01-01",
 *                "end": "2020-01-17"
 *              }
 *            }
 *          ],
 *          "externalLinks": [],
 *          "clientId": "5df3617161282d7007097f6b",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-02-04T08:56:36.712Z",
 *            "updatedAt": "2020-02-04T08:56:36.712Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5e3931c464fea431a7e0b724",
 *          "name": "OUB-C1-4FEV",
 *          "client": "oubra CHD",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-02-05T00:00:00.000Z",
 *          "endDate": "2020-12-31T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e39320e64fea431a7e0b736",
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P3D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "critical": "critical",
 *              "generic": false,
 *              "technicalReferent": "",
 *              "os": "Linux",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "externalLinks": [],
 *          "clientId": "5e39316f64fea431a7e0b722",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-03-27T13:44:41.761Z",
 *            "updatedAt": "2020-03-27T13:44:41.761Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "",
 *          "schemaVersion": 1,
 *          "_id": "5e7e034981e3d43b645ed284",
 *          "name": "Contract SNCF 2020",
 *          "client": "SNCF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-03-25T00:00:00.000Z",
 *          "endDate": "2020-07-20T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "9",
 *            "end": "18"
 *          },
 *          "description": "",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": []
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [],
 *          "externalLinks": [],
 *          "clientId": "5e7e02fe81e3d43b645ed282",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-02-18T14:51:07.353Z",
 *            "updatedAt": "2020-02-18T14:51:07.353Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5e4bf9db0975516f75524237",
 *          "name": "CONTRACT1",
 *          "client": "EDF",
 *          "contact": {
 *            "commercial": "",
 *            "technical": ""
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-02-18T00:00:00.000Z",
 *          "endDate": "2029-02-23T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "9",
 *            "end": "18"
 *          },
 *          "description": "c",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e4bfa6f0975516f75524250",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "P1DT2H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1DT2H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1DT2H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e4bfa6f0975516f7552424f",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P3DT4H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P3DT4H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P3DT4H",
 *                    "nonBusinessHours": "P3DT4H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e4bfa6f0975516f7552424e",
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "P4DT5H",
 *                    "nonBusinessHours": "P4DT5H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P4DT5H",
 *                    "nonBusinessHours": "P4DT5H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P4DT5H",
 *                    "nonBusinessHours": "P4DT5H"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e4bfbe60975516f75524381",
 *                  "request": "Information",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P0D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-24T14:12:47.310Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db1b15f77e2cc0eb067a2cf",
 *                "name": "openpes",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "critical": "critical",
 *              "generic": "yes",
 *              "technicalReferent": "Khaled FERJANI",
 *              "os": "WIN",
 *              "version": "1",
 *              "SupportDate": {
 *                "start": "2020-02-18",
 *                "end": "2029-02-21"
 *              }
 *            }
 *          ],
 *          "externalLinks": [],
 *          "clientId": "5d9cc4376f254d5cf1d1d307",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": true
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-03-26T09:24:53.619Z",
 *            "updatedAt": "2020-03-26T09:24:53.619Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5e7c74e53687003605f59325",
 *          "name": "Support MCO Application Moodle",
 *          "client": "Ministère du bien être",
 *          "contact": {
 *            "commercial": "André Mathieu",
 *            "technical": "Michel Dang"
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-03-24T00:00:00.000Z",
 *          "endDate": "2020-04-29T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "8",
 *            "end": "19"
 *          },
 *          "description": "Hébergement\nMaintien en conditions opérationnelles\nMaintenance corrective\nPour l'application Doodle d'auto formation pour les agents du ministère",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e7c7bc93687003605f594b7",
 *                  "request": "Information",
 *                  "severity": "None",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7bc93687003605f594b6",
 *                  "request": "Administration",
 *                  "severity": "None",
 *                  "supported": {
 *                    "businessHours": "P3D",
 *                    "nonBusinessHours": "P3D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P8D",
 *                    "nonBusinessHours": "P8D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7bc93687003605f594b5",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P3D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P3D",
 *                    "nonBusinessHours": "P5D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7bc93687003605f594b4",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P2D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P3D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7bc93687003605f594b3",
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "PT1H"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "PT4H",
 *                    "nonBusinessHours": "PT4H"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P1D",
 *                    "nonBusinessHours": "P1D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": []
 *            },
 *            "standard": {
 *              "engagements": []
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2020-03-26T09:36:41.373Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5e7c77a93687003605f593fa",
 *                "name": "Moodle OpenHackademy",
 *                "summary": "Application Moodle et paramétrages/plugins spécifiques pour le site OpenHackademy du ministère du bien être",
 *                "description": "Application d'apprentissage en ligne basée sur Moodle",
 *                "licence": "GNU General Public License (GPL)",
 *                "technology": "PHP",
 *                "externalLinks": [],
 *                "__v": 0,
 *                "group": " Serveurs d'applications"
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "Christophe HAMERLING",
 *              "os": "Ubuntu",
 *              "version": "1.0",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "externalLinks": [
 *            {
 *              "name": "application maintenue",
 *              "url": "https://learn.openhackademy.com"
 *            }
 *          ],
 *          "clientId": "5e7c73123687003605f59305",
 *          "__v": 0
 *        },
 *        {
 *          "features": {
 *            "nonBusinessHours": false
 *          },
 *          "timestamps": {
 *            "createdAt": "2020-03-26T09:20:44.570Z",
 *            "updatedAt": "2020-03-26T09:20:44.570Z"
 *          },
 *          "status": true,
 *          "timezone": "Europe/Paris",
 *          "type": "unlimited",
 *          "schemaVersion": 1,
 *          "_id": "5e7c73ec3687003605f59323",
 *          "name": "Support sur les logiciels libres",
 *          "client": "Ministère du bien être",
 *          "contact": {
 *            "commercial": "Erwan Benadou",
 *            "technical": "Jean Chadi"
 *          },
 *          "mailingList": {
 *            "internal": [],
 *            "external": []
 *          },
 *          "startDate": "2020-03-01T00:00:00.000Z",
 *          "endDate": "2021-02-28T00:00:00.000Z",
 *          "businessHours": {
 *            "start": "9",
 *            "end": "18"
 *          },
 *          "description": "Support d'un catalogue de logiciels open source",
 *          "humanResources": {
 *            "teams": [],
 *            "beneficiaries": []
 *          },
 *          "Engagements": {
 *            "critical": {
 *              "engagements": [
 *                {
 *                  "_id": "5e7c7f3c80fa03277966b6e0",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P20D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7f3c80fa03277966b6df",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7f3c80fa03277966b6de",
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P5D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c7fa180fa03277966b6e2",
 *                  "request": "Information",
 *                  "severity": "None",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P30D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "sensible": {
 *              "engagements": [
 *                {
 *                  "_id": "5e7c805a80fa03277966b703",
 *                  "request": "Information",
 *                  "severity": "None",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P30D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c805a80fa03277966b702",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P30D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P50D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c805a80fa03277966b701",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P15D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P35D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c805a80fa03277966b700",
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P15D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            },
 *            "standard": {
 *              "engagements": [
 *                {
 *                  "_id": "5e7c837380fa03277966b83b",
 *                  "request": "Information",
 *                  "severity": "None",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P50D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c837380fa03277966b83a",
 *                  "request": "Anomaly",
 *                  "severity": "Minor",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P40D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P60D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c837380fa03277966b839",
 *                  "request": "Anomaly",
 *                  "severity": "Major",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P30D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P55D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c837380fa03277966b838",
 *                  "request": "Anomaly",
 *                  "severity": "Blocking",
 *                  "supported": {
 *                    "businessHours": "PT1H",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P15D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P20D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                },
 *                {
 *                  "_id": "5e7c837380fa03277966b837",
 *                  "request": "demande de devis",
 *                  "severity": "None",
 *                  "supported": {
 *                    "businessHours": "P2D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "bypassed": {
 *                    "businessHours": "P3D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "resolved": {
 *                    "businessHours": "P10D",
 *                    "nonBusinessHours": "P0D"
 *                  },
 *                  "description": ""
 *                }
 *              ]
 *            }
 *          },
 *          "software": [
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2020-03-26T09:34:43.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5e7c77333687003605f593f8",
 *                "name": "Drupal",
 *                "description": "Drupal est un système de gestion de contenu libre et open-source publié sous la licence publique générale GNU et écrit en PHP.",
 *                "licence": "GNU General Public License (GPL)",
 *                "technology": "PHP",
 *                "group": "Outils et langages",
 *                "externalLinks": [
 *                  {
 *                    "name": "lien de la communauté",
 *                    "url": "https://www.drupal.org"
 *                  }
 *                ],
 *                "__v": 0,
 *                "summary": "CMS leader"
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "Michel-Marie MAUDET",
 *              "os": "CentOS",
 *              "version": "8.3",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2020-03-26T09:34:43.253Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5e7c77333687003605f593f8",
 *                "name": "Drupal",
 *                "description": "Drupal est un système de gestion de contenu libre et open-source publié sous la licence publique générale GNU et écrit en PHP.",
 *                "licence": "GNU General Public License (GPL)",
 *                "technology": "PHP",
 *                "group": "Outils et langages",
 *                "externalLinks": [
 *                  {
 *                    "name": "lien de la communauté",
 *                    "url": "https://www.drupal.org"
 *                  }
 *                ],
 *                "__v": 0,
 *                "summary": "CMS leader"
 *              },
 *              "critical": "critical",
 *              "technicalReferent": "Michel-Marie MAUDET",
 *              "os": "CentOS",
 *              "version": "8.2",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:56:47.429Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0864f77e2cc0eb0679e5a",
 *                "name": "Linshare",
 *                "summary": "Linshare",
 *                "description": "Drag and drop your file",
 *                "__v": 0,
 *                "externalLinks": []
 *              },
 *              "critical": "sensible",
 *              "technicalReferent": "Wajdi GHARBI",
 *              "os": "Ubuntu",
 *              "version": "2.4",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            },
 *            {
 *              "software": {
 *                "timestamps": {
 *                  "creation": "2019-10-23T16:55:44.369Z"
 *                },
 *                "schemaVersion": 1,
 *                "_id": "5db0861077e2cc0eb0679e58",
 *                "name": "OpenPaas",
 *                "summary": "Entreprise social network",
 *                "description": "\nOpenPaaS est une plateforme de microservices permettant la mise en place de solutions de travail collaboratif dernière génération",
 *                "__v": 0,
 *                "externalLinks": [],
 *                "technology": "Web",
 *                "licence": "GNU Library or 'Lesser' General Public License (LGPL)"
 *              },
 *              "critical": "standard",
 *              "technicalReferent": "Fabien MOYON",
 *              "os": "Ubuntu",
 *              "version": "1.4",
 *              "SupportDate": {
 *                "start": "",
 *                "end": ""
 *              }
 *            }
 *          ],
 *          "externalLinks": [],
 *          "clientId": "5e7c73123687003605f59305",
 *          "__v": 0
 *        }
 *        ]
 */
