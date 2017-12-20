'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('The POST /ticketing/api/contracts/:contractId/software/:softwareId', function() {
  let app, lib, helpers, ObjectId, esIntervalIndex, apiURL;
  let user1, user2, software, contract, organization;
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
      lib.organization.create({
        shortName: 'organization'
      })
      .then(createOrganization => (organization = createOrganization)))
    .then(() => done())
    .catch(err => done(err));
  });

  beforeEach(function(done) {
    const softwareJson = {
      name: 'software',
      category: 'category',
      versions: ['1', '2', '3']
    };

    lib.software.create(softwareJson)
      .then(createdSoftware => {
        software = createdSoftware;
        done();
      })
      .catch(err => done(err));
  });

  beforeEach(function(done) {
    const demandJson = {
      demandType: 'demandType1',
      softwareType: 'softwareType1',
      issueType: 'issueType1'
    };

    lib.contract.create({
      title: 'contract1',
      organization: organization._id,
      startDate: new Date(),
      endDate: new Date(),
      demands: [
        demandJson
      ],
      software: [{
        template: software._id,
        type: demandJson.softwareType,
        versions: software.versions
      }]
    })
    .then(createdContract => {
      contract = createdContract;
      apiURL = `/ticketing/api/contracts/${contract._id}/software/${software._id}`;
      done();
    })
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', apiURL, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if contract ID is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/abc/software/${software._id}`));

      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if software ID is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}/software/abc`));

      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Software not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if contract is not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${new ObjectId()}/software/${software._id}`));

      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no versions is provided', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software versions is required and must be an array which has at least one version' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if versions is not an array', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        versions: 'string'
      });

      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software versions is required and must be an array which has at least one version' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if versions is an empty array', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        versions: []
      });

      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software versions is required and must be an array which has at least one version' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if software is not exist in contract', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/ticketing/api/contracts/${contract._id}/software/${new ObjectId()}`));

      req.send({
        versions: ['1', '2']
      });

      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Software not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is unsupported versions', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        versions: ['9', '10']
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software versions are unsupported' }
          });
          done();
        }));
    }));
  });

  it('should respond 204 if success to update software for contract', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        versions: software.versions
      });
      req.expect(204)
        .end(helpers.callbacks.noErrorAnd(() => {
          lib.contract.getById(contract._id)
            .then(updatedContract => {
              expect(updatedContract.software.length).to.equal(1);
              expect(updatedContract.software[0].versions).to.have.members(software.versions);

              setTimeout(() => {
                lib.contract.search({
                  search: contract.title
                }).then(result => {
                  expect(result.list[0].software[0].template).to.deep.equal({
                    _id: software._id.toString(),
                    name: software.name
                  });
                  expect(result.list[0].software[0].versions).to.have.members(software.versions);
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
