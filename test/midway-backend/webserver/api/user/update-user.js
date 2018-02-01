'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const API_PATH = '/ticketing/api/users';

describe('The update Ticketing user API: PUT /ticketing/api/users/:id', function() {
  let app, lib, helpers, ObjectId, esIntervalIndex;
  let coreUser;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
    ObjectId = mongoose.Types.ObjectId;
    app = this.app;
    lib = this.lib;
    esIntervalIndex = this.testEnv.serversConfig.elasticsearch.interval_index;
    coreUser = require(this.testEnv.basePath + '/backend/core/user');

    const deployOptions = {
      fixtures: path.normalize(`${__dirname}/../../../fixtures/deployments`)
    };

    helpers.api.applyDomainDeployment('ticketingModule', deployOptions, (err, models) => {
      if (err) {
        return done(err);
      }

      user1 = models.users[1];
      user2 = models.users[2];

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

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'put', `${API_PATH}/${user2._id}`, done);
  });

  it('should respond 400 if no main_phone is given', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`${API_PATH}/${user2._id}`));
      const modifiedUser = {
        description: 'modified description'
      };

      req.send(modifiedUser);
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
      const req = requestAsMember(request(app).put(`${API_PATH}/${user2._id}`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if user id is invalid', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`${API_PATH}/invalid-id`));
      const modifiedUser = {
        main_phone: '666',
        description: 'modified description'
      };

      req.send(modifiedUser);
      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'User not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if user not found', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`${API_PATH}/${new ObjectId()}`));
      const modifiedUser = {
        main_phone: '666',
        description: 'modified description'
      };

      req.send(modifiedUser);
      req.expect(404)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'User not found' }
          });
          done();
        }));
    }));
  });

  it('should respond 204 if update user successfully', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`${API_PATH}/${user2._id}`));
      const modifiedUser = {
        main_phone: '666',
        description: 'modified description'
      };

      req.send(modifiedUser);
      req.expect(204)
        .end(helpers.callbacks.noError(() => {
          coreUser.get(user2._id, helpers.callbacks.noErrorAnd(result => {
            expect(result.main_phone).to.equal(modifiedUser.main_phone);
            expect(result.description).to.equal(modifiedUser.description);

            setTimeout(function() {
              lib.user.search({ search: user2.firstname })
                .then(result => {
                  expect(result.total_count).to.equal(1);
                  expect(result.list[0]).to.shallowDeepEqual({
                    main_phone: modifiedUser.main_phone,
                    description: modifiedUser.description
                  });
                  done();
                })
                .catch(err => done(err || 'should resolve'));
            }, esIntervalIndex);
          }));
        }));
    }));
  });
});
