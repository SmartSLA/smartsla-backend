'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';
const API_PATH = '/api/users';

describe('The create Ticketing user API: POST /api/users', function() {
  let app, lib, helpers;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;

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
        .then(() => { done(); })
        .catch(err => done(err));
      });
    });
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(done);
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'post', API_PATH, done);
  });

  it('should respond 400 if no firstname is given', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newUser = {
        lastname: 'foo',
        email: 'bar@tic.org',
        main_phone: '888'
      };

      req.send(newUser);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'firstname is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if no lastname is given', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newUser = {
        firstname: 'foo',
        email: 'bar@tic.org',
        main_phone: '888'
      };

      req.send(newUser);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'lastname is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if no email is given', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newUser = {
        firstname: 'foo',
        lastname: 'bar',
        main_phone: '888'
      };

      req.send(newUser);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'email is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if email is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newUser = {
        firstname: 'foo',
        lastname: 'bar',
        email: 'invalid-email',
        main_phone: '888'
      };

      req.send(newUser);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'email is invalid' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if no main_phone is given', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newUser = {
        firstname: 'foo',
        lastname: 'bar',
        email: 'bar@tic.org'
      };

      req.send(newUser);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'main_phone is required' }
          });
          done();
        }));
    }));
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

  it('should respond 201 if create user successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      const newUser = {
        firstname: 'foo',
        lastname: 'bar',
        email: 'bar@tic.org',
        main_phone: '888'
      };

      req.send(newUser);
      req.expect(201)
        .end(helpers.callbacks.noErrorAnd(res => {
          newUser.accounts = [{
            type: 'email',
            emails: [newUser.email]
          }];
          delete newUser.email;

          expect(res.body).to.shallowDeepEqual(newUser);
          lib.ticketingUserRole.getByUser(res.body._id)
            .then(userRole => {
              expect(userRole).to.exist;
              done();
            });
        }));
    }));
  });
});
