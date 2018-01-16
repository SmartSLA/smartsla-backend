'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('POST /ticketing/api/tickets/:id', function() {
  const API_PATH = '/ticketing/api/tickets';
  let app, lib, helpers, ObjectId;
  let user1, user2, organization, demand1, demand2, software, contract, ticket;
  const password = 'secret';
  const description = 'fooooooooooooooooooooooooooooooooooooooooooooooooo';

  beforeEach(function(done) {
    app = this.app;
    lib = this.lib;
    helpers = this.helpers;
    ObjectId = this.testEnv.core.db.mongo.mongoose.Types.ObjectId;

    const deployOptions = {
      fixtures: path.normalize(`${__dirname}/../../../fixtures/deployments`)
    };

    helpers.api.applyDomainDeployment('ticketingModule', deployOptions, (err, models) => {
      if (err) {
        return done(err);
      }

      user1 = models.users[1];
      user2 = models.users[2];

      done();
    });
  });

  beforeEach(function(done) {
    lib.ticketingUserRole.create({
      user: user1._id,
      role: 'administrator'
    })
    .then(() =>
      lib.ticketingUserRole.create({
        user: user2._id,
        role: 'user'
      })
    )
    .then(() => done())
    .catch(err => done(err));
  });

  beforeEach(function(done) {
    demand1 = {
      demandType: 'Info1',
      softwareType: 'Normal1',
      issueType: 'Blocking1'
    };
    demand2 = {
      demandType: 'Info2',
      softwareType: 'Normal2',
      issueType: 'Blocking2'
    };

    lib.software.create({
      name: 'software1',
      category: 'category1',
      versions: ['1', '2', '3']
    })
    .then(createdSofware => { software = createdSofware; })
    .then(() =>
      lib.organization.create({
        shortName: 'organization'
      })
      .then(createOrganization => (organization = createOrganization))
    )
    .then(() =>
      lib.contract.create({
        title: 'contract',
        organization: organization._id,
        defaultSupportManager: user1._id,
        startDate: new Date(),
        endDate: new Date(),
        demands: [demand1, demand2],
        software: [{
          template: software._id,
          type: demand1.softwareType,
          versions: ['1', '2']
        }]
      })
      .then(createdContract => (contract = createdContract))
    )
    .then(() =>
      lib.ticket.create({
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id]
      })
      .then(createdTicket => {
        ticket = createdTicket;
        done();
      })
    )
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  const getObjectFromModel = document => JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', `${API_PATH}/${ticket._id}`, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no title in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        demandType: demand1.demandType
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'title is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no demandType in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title'
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'demandType is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no description in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'description is required and must be a string with minimum length of 50' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if description is not a string', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        description: []
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'description is required and must be a string with minimum length of 50' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if description is not a string with minimum length of 50', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: 'info',
        description: 'too short description'
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'description is required and must be a string with minimum length of 50' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if environment is not a string', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: 'info',
        description,
        environment: []
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'environment must be a string' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if software is provided but template is not provied', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        description,
        software: {
          criticality: demand1.softwareType,
          version: software.versions[1]
        }
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'software is invalid: template, version and criticality are required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if software is provided but version is not provied', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand2.demandType,
        description,
        software: {
          template: software._id,
          criticality: demand1.softwareType
        }
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'software is invalid: template, version and criticality are required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if software is provided but criticality is not provied', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand2.demandType,
        description,
        software: {
          template: software._id,
          version: software.versions[0]
        }
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'software is invalid: template, version and criticality are required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if the triple (demandType, severity, software criticality) is not supported', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: 'invalid-severity',
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[0]
        },
        description
      };

      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'the triple (demandType, severity, software criticality) is not supported' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if the pair (software template, software version) is not supported', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: 'invalid-version'
        },
        description
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'the pair (software template, software version) is not supported' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if requester is not provied', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'requester is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if requester is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: 'invalid ObjectId'
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'requester is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if requester is not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: new ObjectId()
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'requester not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if supportManager is not provied', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: user1._id
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'supportManager is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if supportManager is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: user2._id,
        supportManager: 'invalid ObjectId'
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'supportManager is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if supportManager is not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: user2._id,
        supportManager: new ObjectId()
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'supportManager not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if supportTechnicians is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: user2._id,
        supportManager: user2._id,
        supportTechnicians: ['invalid ObjectId']
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'supportTechnicians is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if supportTechnicians are not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const notFoundTechnician = new ObjectId();
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: user2._id,
        supportManager: user2._id,
        supportTechnicians: [user2._id, notFoundTechnician]
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: `supportTechnicians ${notFoundTechnician} are not found` }
          });
          done();
        }));
    }));
  });

  it('should respond 200 with updated ticket', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const modifiedTicket = {
        title: 'modified title',
        demandType: demand1.demandType,
        severity: demand1.issueType,
        software: {
          template: software._id,
          criticality: demand1.softwareType,
          version: software.versions[1]
        },
        description,
        requester: user2._id,
        supportManager: user2._id,
        supportTechnicians: [user1._id, user2._id]
      };
      const req = requestAsMember(request(app).post(`${API_PATH}/${ticket._id}`));

      req.send(modifiedTicket);
      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.shallowDeepEqual(getObjectFromModel(modifiedTicket));
          done();
        }));
    }));
  });
});
