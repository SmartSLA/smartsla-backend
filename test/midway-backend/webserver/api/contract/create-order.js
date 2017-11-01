'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const mongoose = require('mongoose');

describe('POST /api/contracts/:id/orders', function() {
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
        const contractJSON = {
          title: 'contract',
          organization: new ObjectId(),
          startDate: new Date(),
          endDate: new Date()
        };

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
          lib.contract.create(contractJSON)
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

  const caculateDate = (seed, diff) => {
    const result = new Date();

    result.setDate(seed.getDate() + diff);

    return result;
  };

  it('should respond 400 if there is no title in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'title is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no startDate in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        terminationDate: new Date(),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'startDate is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no terminationDate in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: new Date(),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'terminationDate is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid manager in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: contract.startDate,
        terminationDate: contract.endDate,
        type: 'USP',
        manager: 'invalid ObjectId'
      };

      req.send(newOrder);
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
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP',
        defaultSupportManager: 'invalid ObjectId'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'defaultSupportManager is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is invalid permission actors in the payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP',
        permissions: [
          { actor: 'invalid ObjectId', right: 'submit' }
        ]
      };

      req.send(newOrder);
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
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP',
        permissions: [
          { actor: new ObjectId(), right: 'invalid right' }
        ]
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'permissions is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is startDate of order less than contract startDate', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: caculateDate(contract.startDate, -1),
        terminationDate: new Date(),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: `startDate must not be less than ${contract.startDate}` }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is terminationDate of order less than contract endDate', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: new Date(),
        terminationDate: caculateDate(contract.endDate, 1),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: `terminationDate must not be bigger than ${contract.endDate}` }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is startDate bigger than terminationDate', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));
      const newOrder = {
        title: 'order2',
        startDate: caculateDate(contract.endDate, 1),
        terminationDate: caculateDate(contract.endDate, -3),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'startDate must not be bigger than terminationDate' }
          });
          done();
        }));
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', `/api/contracts/${contract._id}/orders`, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
      helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));

        req.expect(403)
          .end(helpers.callbacks.noErrorAnd(res => {
            expect(res.body).to.deep.equal({
              error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
            });
            done();
          }));
      }));
    });

  it('should respond 404 if there is invalid contract in the request params', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post('/api/contracts/invalid_objectid/orders'));
      const newOrder = {
        title: 'order2',
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP'
      };

      req.send(newOrder);
      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Contract not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 201 if create order is successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const newOrder = {
        title: 'order2',
        startDate: contract.startDate,
        terminationDate: contract.endDate,
        type: 'USP'
      };
      const req = requestAsMember(request(app).post(`/api/contracts/${contract._id}/orders`));

      req.send(newOrder);
      req.expect(201)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body.title).to.equal(newOrder.title);

          lib.contract.getById(contract._id)
            .then(contract => {
              expect(contract.orders).to.include(res.body._id);
              done();
            });
        }));
    }));
  });
});
