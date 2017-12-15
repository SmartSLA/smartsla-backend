'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('POST /api/tickets', function() {
  const API_PATH = '/api/tickets';
  let app, lib, helpers, ObjectId;
  let user1, user2, contract, demand, software;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;
    ObjectId = this.testEnv.core.db.mongo.mongoose.Types.ObjectId;

    helpers.modules.initMidway(MODULE_NAME, function(err) {
      if (err) {
        return done(err);
      }
      const ticketingApp = require(self.testEnv.backendPath + '/webserver/application')(helpers.modules.current.deps);
      const api = require(self.testEnv.backendPath + '/webserver/api')(helpers.modules.current.deps, helpers.modules.current.lib.lib);

      ticketingApp.use(require('body-parser').json());
      ticketingApp.use('/api', api);

      app = helpers.modules.getWebServer(ticketingApp);
      const deployOptions = {
        fixtures: path.normalize(`${__dirname}/../../../fixtures/deployments`)
      };

      helpers.api.applyDomainDeployment('ticketingModule', deployOptions, function(err, models) {
        if (err) {
          return done(err);
        }

        user1 = models.users[1];
        user2 = models.users[2];
        lib = helpers.modules.current.lib.lib;

        demand = {
          demandType: 'Info',
          softwareType: 'Normal',
          issueType: 'Blocking'
        };
        software = {
          template: new ObjectId(),
          type: demand.softwareType,
          versions: ['1', '2']
        };

        lib.start(err => {
          if (err) {
            done(err);
          }

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
          .then(() =>
            lib.contract.create({
              title: 'contract',
              organization: new ObjectId(),
              defaultSupportManager: new ObjectId(),
              startDate: new Date(),
              endDate: new Date(),
              demands: [demand],
              software: [software]
            })
          )
          .then(createdContract => {
            contract = createdContract;

            done();
          })
          .catch(err => done(err));
        });
      });
    });
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function getObjectFromModel(document) {
    return JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date
  }

  it('should respond 400 if there is no contract in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        title: 'ticket 1'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'contract is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if contract is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        contract: 'invalid-id'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'contract is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no title in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        contract: contract._id
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
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
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
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
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: 'info'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
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
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: 'info',
        description: []
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
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
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: 'info',
        description: 'too short description'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
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
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: 'info',
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        environment: []
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'environment must be a string' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if files is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: 'info',
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo',
        files: [1, 2]
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'files is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if contract not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        contract: new ObjectId(),
        title: 'ticket 1',
        demandType: 'info',
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if the triple (demandType, severity, software criticality) is not supported', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand.demandType,
        severity: 'invalid-severity',
        software: {
          template: software.template,
          criticality: software.type,
          version: software.versions[0]
        },
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
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
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand.demandType,
        severity: demand.issueType,
        software: {
          template: software.template,
          criticality: software.type,
          version: 'invalid-version'
        },
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'the pair (software template, software version) is not supported' }
          });
          done();
        }));
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', API_PATH, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 201 if create ticket successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newTicket = {
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand.demandType,
        severity: demand.issueType,
        software: {
          template: software.template,
          criticality: software.type,
          version: '2'
        },
        description: 'fooooooooooooooooooooooooooooooooooooooooooooooooo'
      };
      const req = requestAsMember(request(app).post(API_PATH));

      req.send(newTicket);
      req.expect(201)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.shallowDeepEqual(getObjectFromModel(newTicket));
          done();
        }));
    }));
  });
});
