'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const mongoose = require('mongoose');

describe('POST /api/contracts', function() {
  let app, lib, helpers, ObjectId;
  let user1, user2, contract;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;
    ObjectId = mongoose.Types.ObjectId;

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

        lib.ticketingUserRole.create({
          user: user1._id,
          role: 'administrator'
        })
        .then(() => {
          lib.ticketingUserRole.create({
            user: user2._id,
            role: 'user'
          });
        })
        .then(() => {
          lib.contract.create({
            title: 'contract1',
            organization: new ObjectId(),
            startDate: new Date(),
            endDate: new Date()
          })
          .then(createdContract => {
            contract = createdContract;
            done();
          });
        })
        .catch(err => done(err));
      });
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(done);
  });

  it('should respond 400 if there is no title in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date()
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'title is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no organization in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        startDate: new Date(),
        endDate: new Date()
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'organization is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no startDate in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        endDate: new Date()
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'startDate is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no endDate in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date()
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'endDate is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid organization in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: 'invalid ObjectId',
        startDate: new Date(),
        endDate: new Date()
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'organization is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid manager in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        manager: 'invalid ObjectId'
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'manager is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid defaultSupportManager in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        defaultSupportManager: 'invalid ObjectId'
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'defaultSupportManager is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid users in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        users: ['invalid ObjectId']
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'users is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid permission actors in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        permissions: [
          { actor: 'invalid ObjectId', right: 'submit' }
        ]
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'permissions is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid permission right in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        permissions: [
          { actor: new ObjectId(), right: 'invalid right' }
        ]
      };

      req.send(newContract);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'permissions is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', '/api/contracts', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
      helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).post('/api/contracts'));

        req.expect(403)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
            });
            done();
          }));
      }));
    });

  it('should respond 201 if create contract is successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date()
      };
      const req = requestAsMember(request(app).post('/api/contracts'));

      req.send(newContract);
      req.expect(201)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.shortName).to.equal(contract.shortName);
          done();
        }));
    }));
  });
});
