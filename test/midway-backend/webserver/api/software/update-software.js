'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('PUT /ticketing/api/software/:id', function() {
  let app, lib, helpers;
  let user1, user2, software;
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

      done();
    });
  });

  beforeEach(function(done) {
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
      lib.software.create({
        name: 'foo',
        category: 'foz',
        versions: ['1']
      })
        .then(createdSofware => {
          software = createdSofware;

          done();
        });
    })
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 400 if there is no name in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));
      const softwareToUpdate = {
        category: 'foo',
        versions: ['1']
      };

      req.send(softwareToUpdate);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'name is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no category in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));
      const softwareToUpdate = {
        name: 'foo',
        versions: ['1']
      };

      req.send(softwareToUpdate);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'category is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if there is no versions in payload', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));
      const softwareToUpdate = {
        name: 'foo',
        category: 'bar'
      };

      req.send(softwareToUpdate);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'versions is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if versions is not an array', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));
      const softwareToUpdate = {
        name: 'foo',
        category: 'bar',
        versions: 'string'
      };

      req.send(softwareToUpdate);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'versions must be an array' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if versions is an empty array', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));
      const softwareToUpdate = {
        name: 'foo',
        category: 'bar',
        versions: []
      };

      req.send(softwareToUpdate);
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'versions must not be empty' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if name is taken', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));

      lib.software.create({
        name: 'bar',
        category: 'baz',
        versions: ['1']
      })
        .then(createdSofware => {
          const softwareToUpdate = {
            name: createdSofware.name,
            category: 'baz',
            versions: ['1']
          };

          req.send(softwareToUpdate);
          req.expect(400)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.body).to.deep.equal({
                error: { code: 400, message: 'Bad Request', details: 'name is taken' }
              });
              done();
            }));
        }, err => done(err || 'should resolve'));
    }));
  });

  it('should respond 400 if lowercase of name is taken', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));

      lib.software.create({
        name: 'bar',
        category: 'baz',
        versions: ['1']
      })
        .then(() => {
          const softwareToUpdate = {
            name: 'BAR',
            category: 'baz',
            versions: ['1']
          };

          req.send(softwareToUpdate);
          req.expect(400)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.body).to.deep.equal({
                error: { code: 400, message: 'Bad Request', details: 'name is taken' }
              });
              done();
            }));
        }, err => done(err || 'should resolve'));
    }));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'put', `/ticketing/api/software/${software._id}`, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 204 if update software successfully', function(done) {
      helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
        const softwareToUpdate = {
          name: software.name,
          category: 'baz',
          versions: ['1', '2']
        };
        const req = requestAsMember(request(app).put(`/ticketing/api/software/${software._id}`));

        req.send(softwareToUpdate);
        req.expect(204)
          .end(helpers.callbacks.noErrorAnd(() => {
            lib.software.getById(software._id)
              .then(updatedSoftware => {
                expect(updatedSoftware.name).to.equal(softwareToUpdate.name);
                expect(updatedSoftware.category).to.equal(softwareToUpdate.category);
                expect(updatedSoftware.versions).to.deep.equal(softwareToUpdate.versions);
              });
            done();
          }));
      }));
    });
});
