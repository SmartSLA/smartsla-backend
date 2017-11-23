'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const mongoose = require('mongoose');

describe('The POST /api/contracts/:id/software', function() {
  let app, lib, helpers, ObjectId, apiURL;
  let user1, user2, software1, software2, software3, request1, request2, contract;
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
        .then(() => done())
        .catch(err => done(err));
      });
    });
  });

  beforeEach(function(done) {
    const software1Json = {
      name: 'software1',
      category: 'category1',
      versions: ['1', '2']
    };

    const software2Json = {
      name: 'software2',
      category: 'category2',
      versions: ['3', '4']
    };

    const software3Json = {
      active: false,
      name: 'software3',
      category: 'category3',
      versions: ['5', '6']
    };

    lib.software.create(software1Json)
      .then(createdSoftware1 => {
        software1 = createdSoftware1;

        lib.software.create(software2Json)
          .then(createdSoftware2 => {
            software2 = createdSoftware2;

            lib.software.create(software3Json)
              .then(createdSoftware3 => {
                software3 = createdSoftware3;

                done();
              });
          });
      })
      .catch(err => done(err));
  });

  beforeEach(function(done) {
    request1 = {
      requestType: 'requestType1',
      softwareType: 'softwareType1',
      issueType: 'issueType1'
    };

    request2 = {
      requestType: 'requestType2',
      softwareType: 'softwareType2',
      issueType: 'issueType2'
    };

    lib.contract.create({
      title: 'contract1',
      organization: new ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      requests: [
        request1,
        request2
      ],
      software: [{
        template: software1._id,
        type: request1.softwareType,
        versions: software1.versions
      }]
    })
    .then(createdContract => {
      contract = createdContract;
      apiURL = `/api/contracts/${contract._id}/software`;
      done();
    })
    .catch(err => done(err));
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
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

  it('should respond 400 if template is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: 'wrong ObjectId()',
        type: request1.softwareType,
        versions: software1.versions
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if software not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: new ObjectId(),
        type: request1.softwareType,
        versions: software1.versions
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software is not available' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if software is not active', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software3._id,
        type: request1.softwareType,
        versions: software1.versions
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software is not available' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is a duplicated software', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software1._id,
        type: request1.softwareType,
        versions: software1.versions
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software already exists' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no type is provided', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software2._id,
        versions: software2.versions
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software type is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is unsupported type', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software2._id,
        type: 'unsupported type',
        versions: software2.versions
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software type is unsupported' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no versions is provided', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software2._id,
        type: request1.softwareType
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software versions is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is unsupported versions', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software2._id,
        type: request1.softwareType,
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

  it('should respond 204 if success to add software for contract', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        template: software2._id,
        type: request1.softwareType,
        versions: [software2.versions[0]]
      });
      req.expect(204)
        .end(helpers.callbacks.noErrorAnd(() => {
          lib.contract.getById(contract._id)
            .then(updatedContract => {
              expect(updatedContract.software.length).to.equal(2);
              expect(updatedContract.software[1].template.toString()).to.equal(software2._id.toString());
              done();
            });
        }));
    }));
  });
});
