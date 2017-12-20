'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;
const API_PATH = '/ticketing/api/users';

describe('The create Ticketing user API: POST /ticketing/api/users', function() {
  let app, lib, helpers;
  let user1, user2;
  const password = 'secret';

  beforeEach(function(done) {
    helpers = this.helpers;
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
          newUser.emails = [newUser.email];
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

  it('should respond 201 if success to create user which belong to an entity', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(API_PATH));
      let organization, entity, entityJson;

      lib.organization.create({
        shortName: 'organization'
      }).then(createdOrganization => {
        organization = createdOrganization;
        entityJson = {
          parent: createdOrganization._id,
          shortName: 'entity'
        };

        return lib.organization.create(entityJson).then(createdEntity => {
          entity = createdEntity;
        });
      }).then(() => {
        const newUser = {
          firstname: 'foo',
          lastname: 'bar',
          email: 'bar@tic.org',
          main_phone: '888',
          entity
        };

        req.send(newUser);
        req.expect(201)
          .end(helpers.callbacks.noErrorAnd(res => {
            newUser.emails = [newUser.email];
            delete newUser.email;

            expect(res.body).to.shallowDeepEqual({
              firstname: newUser.firstname,
              lastname: newUser.lastname,
              main_phone: newUser.main_phone,
              entity: {
                parent: {
                  shortName: organization.shortName
                },
                shortName: entity.shortName
              }
            });

            lib.ticketingUserRole.getByUser(res.body._id)
              .then(userRole => {
                expect(userRole).to.exist;
                done();
              });
          }));
      });
    }));
  });
});
