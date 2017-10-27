'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const mongoose = require('mongoose');

describe('The organization API', function() {
  let app, lib, helpers, ObjectId;
  let user1, user2, organization;
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
        fixtures: path.normalize(`${__dirname}/../../fixtures/deployments`)
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
          lib.organization.create({
            shortName: 'organization'
          })
          .then(createdOrganization => {
            organization = createdOrganization;
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

  function getObjectFromModel(document) {
    return JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date
  }

  describe('GET /api/organizations', function() {
    it('should respond 401 if not logged in', function(done) {
      helpers.api.requireLogin(app, 'get', '/api/organizations', done);
    });

    it('should respond 403 if user is not an administrator', function(done) {
      helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get('/api/organizations'));

        req.expect(403)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
            });
            done();
          }));
      }));
    });

    it('should respond 200 if user is an administrator', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).get('/api/organizations'));
        const expectResult = [getObjectFromModel(organization)];

        req.expect(200)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.headers['x-esn-items-count']).to.exist;
            expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
            expect(res.body).to.shallowDeepEqual(expectResult);
            done();
          }));
      }));
    });

    it('should respond 200 with the list contains only latest organization if offset=0 and limit=1', function(done) {
      lib.organization.create({
        shortName: 'organization2'
      })
      .then(createdOrganization => {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get('/api/organizations'));
          const expectResult = [getObjectFromModel(createdOrganization)];

          req.query({ offset: 0, limit: 1 });
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
              expect(res.body).to.shallowDeepEqual(expectResult);
              done();
            }));
        }));
      }, err => done(err || 'should resolve'));
    });

    it('should respond 200 with the list contains only oldest organization if offset=1', function(done) {
      lib.organization.create({
        shortName: 'organization2'
      })
      .then(() => {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const req = requestAsMember(request(app).get('/api/organizations'));
          const expectResult = [getObjectFromModel(organization)];

          req.query({ offset: 1 });
          req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.exist;
              expect(res.headers['x-esn-items-count']).to.equal(`${expectResult.length}`);
              expect(res.body).to.shallowDeepEqual(expectResult);
              done();
            }));
        }));
      }, err => done(err || 'should resolve'));
    });
  });

  describe('POST /api/organizations', function() {
    it('should respond 400 if there is no shortName in payload', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).post('/api/organizations'));
        const newOrganization = {
          foo: 'baz'
        };

        req.send(newOrganization);
        req.expect(400)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 400, message: 'Bad Request', details: 'shortName is required' }
            });
            done();
          }));
      }));
    });

    it('should respond 400 if administrator is invalid', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).post('/api/organizations'));
        const newOrganization = {
          shortName: 'baz',
          administrator: 'wrong_objectId'
        };

        req.send(newOrganization);
        req.expect(400)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 400, message: 'Bad Request', details: 'administrator is invalid' }
            });
            done();
          }));
      }));
    });

    it('should respond 400 if shortName is taken', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).post('/api/organizations'));
        const newOrganization = {
          shortName: organization.shortName
        };

        req.send(newOrganization);
        req.expect(400)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 400, message: 'Bad Request', details: 'shortName is taken' }
            });
            done();
          }));
      }));
    });

    it('should respond 401 if not logged in', function(done) {
      helpers.api.requireLogin(app, 'post', '/api/organizations', done);
    });

    it('should respond 403 if user is not an administrator', function(done) {
      helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).post('/api/organizations'));

        req.expect(403)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
            });
            done();
          }));
      }));

      it('should respond 201 if user is an administrator', function(done) {
        helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
          const newOrganization = {
            shortName: 'new'
          };
          const req = requestAsMember(request(app).post('/api/organizations'));

          req.send(newOrganization);
          req.expect(201)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.body.shortName).to.equal(organization.shortName);
              done();
            }));
        }));
      });
    });
  });

  describe('PUT /api/organizations/:id', function() {
    it('should respond 400 if organization payload is invalid', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).put(`/api/organizations/${organization._id}`));
        const newOrganization = {
          foo: 'baz'
        };

        req.send(newOrganization);
        req.expect(400)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 400, message: 'Bad Request', details: 'shortName is required' }
            });
            done();
          }));
      }));
    });

    it('should respond 401 if not logged in', function(done) {
      helpers.api.requireLogin(app, 'put', '/api/organizations/abc', done);
    });

    it('should respond 403 if user is not an administrator', function(done) {
      helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).put('/api/organizations/abc'));

        req.expect(403)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
            });
            done();
          }));
      }));
    });

    it('should respond 404 if organization id is not an ObjectId', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).put('/api/organizations/abc'));
        const newOrganization = {
          shortName: 'new'
        };

        req.send(newOrganization);
        req.expect(404)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 404, message: 'Not Found', details: 'Organization not found' }
            });
            done();
          }));
      }));
    });

    it('should respond 404 if organization not found', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).put(`/api/organizations/${new ObjectId()}`));
        const newOrganization = {
          shortName: 'new'
        };

        req.send(newOrganization);
        req.expect(404)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 404, message: 'Not Found', details: 'Organization not found' }
            });
            done();
          }));
      }));
    });

    it('should respond 204 if user is an administrator', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const newOrganization = {
          shortName: 'new'
        };
        const req = requestAsMember(request(app).put(`/api/organizations/${organization._id}`));

        req.send(newOrganization);
        req.expect(204)
          .end(helpers.callbacks.noErrorAnd(() => {
            lib.organization.getById(organization._id)
              .then(result => {
                expect(result.shortName).to.equal(newOrganization.shortName);
                done();
              }, err => done(err || 'should resolve'));
          }));
      }));
    });
  });
});
