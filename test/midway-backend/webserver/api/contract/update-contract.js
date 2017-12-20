'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('POST /ticketing/api/contracts/:id', function() {
  let app, lib, helpers, ObjectId, esIntervalIndex;
  let user1, user2, contract, software, organization;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    ObjectId = mongoose.Types.ObjectId;
    esIntervalIndex = this.testEnv.serversConfig.elasticsearch.interval_index;
    app = this.app;
    lib = this.lib;

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
      }))
    .then(() =>
      lib.software.create({
        name: 'foo',
        category: 'foz',
        versions: ['1']
      }).then(createdSofware => {
        software = createdSofware;
      }))
    .then(() =>
      lib.organization.create({
        shortName: 'organization'
      })
      .then(createOrganization => (organization = createOrganization)))
    .then(() =>
      lib.contract.create({
        title: 'contract',
        organization: organization._id,
        startDate: new Date(),
        endDate: new Date(),
        software: [
          {
            template: software._id,
            versions: software.versions,
            type: 'critical'
          }
        ]
      })
      .then(createdContract => {
        contract = createdContract;
        done();
      }))
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 400 if there is no title in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));
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

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', '/ticketing/api/contracts/abc', done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/ticketing/api/contracts/abc'));

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
      const req = requestAsMember(request(app).post('/ticketing/api/contracts/abc'));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date()
      };

      req.send(newContract);
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
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${new ObjectId()}`));
      const newContract = {
        title: 'new',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date()
      };

      req.send(newContract);
      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 204 if update contract successfully', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const newContract = {
          title: 'new',
          organization: organization._id,
          startDate: new Date(),
          endDate: new Date()
        };
        const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}`));

        req.send(newContract);
        req.expect(204)
          .end(helpers.callbacks.noErrorAnd(() => {
            lib.contract.getById(contract._id)
              .then(result => {
                expect(result.shortName).to.equal(newContract.shortName);

                setTimeout(function() {
                  lib.contract.search({
                    search: newContract.title
                  }).then(result => {
                    expect(result.list[0].software[0].template).to.deep.equal({
                      _id: software._id.toString(),
                      name: software.name
                    });
                    expect(result.list[0].organization).to.deep.equal({
                      _id: organization._id.toString(),
                      shortName: organization.shortName
                    });
                    done();
                  });
                }, esIntervalIndex);
              })
              .catch(err => done(err || 'should resolve'));
          }));
      }));
    });
});
