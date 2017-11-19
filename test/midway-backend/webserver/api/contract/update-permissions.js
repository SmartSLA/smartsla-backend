'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const mongoose = require('mongoose');

describe('POST /api/contracts/:id/permissions', function() {
  let app, lib, helpers, ObjectId;
  let user1, user2, contract, entity;
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
        .then(() =>
          lib.organization.create({
            shortName: 'organization'
          })
        )
        .then(org =>
          lib.organization.create({
            shortName: 'entity',
            parent: org._id
          })
          .then(createdEntity => {
            entity = createdEntity;

            return lib.contract.create({
              title: 'contract1',
              organization: org._id,
              startDate: new Date(),
              endDate: new Date()
            })
            .then(createdContract => {
              contract = createdContract;
              done();
            });
          })
        )
        .catch(err => done(err));
      });
    });
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  it('should respond 400 if there is invalid permission in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/permissions`));
      const updatePermissions = {
        permissions: ['invalidEntityId', 2]
      };

      req.send(updatePermissions);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'permissions is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is a permission which not belongs to contract\'s organization', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/permissions`));
      const updatePermissions = {
        permissions: [new ObjectId()]
      };

      req.send(updatePermissions);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'permissions not belong to contract\'s organization' }
          });
          done();
        }));
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', `/api/contracts/${contract._id}/permissions`, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/permissions`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if contract id is not an ObjectId', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts/abc/permissions'));
      const updatePermissions = {
        permissions: [new ObjectId()]
      };

      req.send(updatePermissions);
      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if contract is not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${new ObjectId()}/permissions`));
      const updatePermissions = {
        permissions: [new ObjectId()]
      };

      req.send(updatePermissions);
      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 204 if permissions = 1 (all entities have permission)', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/permissions`));
      const updatePermissions = {
        permissions: 1
      };

      req.send(updatePermissions);
      req.expect(204)
        .end(helpers.callbacks.noErrorAnd(() => {
          lib.contract.getById(contract._id)
            .then(result => {
              expect(result.permissions).to.equal(updatePermissions.permissions);
              done();
            }, err => done(err || 'should resolve'));
        }));
    }));
  });

  it('should respond 204 if permissions is blank array (no entity has permission)', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/permissions`));
      const updatePermissions = {
        permissions: []
      };

      req.send(updatePermissions);
      req.expect(204)
        .end(helpers.callbacks.noErrorAnd(() => {
          lib.contract.getById(contract._id)
            .then(result => {
              expect(result.permissions.length).to.equal(0);
              done();
            }, err => done(err || 'should resolve'));
        }));
    }));
  });

  it('should respond 204 if permissions is array of entities of contract\'s organization', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/permissions`));
      const updatePermissions = {
        permissions: [String(entity._id)]
      };

      req.send(updatePermissions);
      req.expect(204)
        .end(helpers.callbacks.noErrorAnd(() => {
          lib.contract.getById(contract._id)
            .then(result => {
              expect(result.permissions).to.shallowDeepEqual(updatePermissions.permissions);
              done();
            }, err => done(err || 'should resolve'));
        }));
    }));
  });
});
