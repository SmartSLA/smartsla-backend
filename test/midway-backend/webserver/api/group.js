'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const q = require('q');

describe('The group API', function() {
  let user, app, lib, group;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    lib = self.helpers.modules.current.lib.lib;
    this.helpers.modules.initMidway('linagora.esn.ticketing', function(err) {
      if (err) {
        return done(err);
      }

      const ticketApp = require(self.testEnv.backendPath + '/webserver/application')(self.helpers.modules.current.deps);
      const api = require(self.testEnv.backendPath + '/webserver/api')(self.helpers.modules.current.deps, lib);

      ticketApp.use(require('body-parser').json());
      ticketApp.use('/api', api);

      app = self.helpers.modules.getWebServer(ticketApp);

      self.helpers.api.applyDomainDeployment('linagora_IT', function(err, models) {
        if (err) {
          return done(err);
        }

        user = models.users[0];
        group = {
          name: 'linagora',
          preferred_contact: 'aymen',
          address: {country: 'Tunisia'},
          is_active: true,
          members: []
        };
        done();
      });
    });
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(done);
  });

  describe('GET /api/groups', function() {
    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'get', '/api/groups', done);
    });

    it('should return a list of groups', function(done) {
      const self = this;

      lib.group.list({}).then(function(groups) {
        self.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
          if (err) {
            return done(err);
          }

          const req = requestAsMember(request(app).get('/api/groups'));

          req.expect(200).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.deep.equal(groups);

            done();
          });
        });
      }, done);
    });
  });

  describe('POST /api/groups', function() {
    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'post', '/api/groups', done);
    });

    it('should create the group', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).post('/api/groups'));

        req.send(group).expect(201).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.shallowDeepEqual(group);

          done();
        });
      });
    });
  });

  describe('DELETE /api/groups', function() {
    let groupA, groupB;
    const otherGroup = {
      name: 'lintunsi',
      preferred_contact: 'aymen',
      address: 'tunis',
      is_active: false,
      members: []
    };

    beforeEach(function(done) {
      q.all([
        lib.group.create(group).then(function(mongoResult) {
          groupA = mongoResult;
        }),
        lib.group.create(otherGroup).then(function(mongoResult) {
          groupB = mongoResult;

          done();
        }, done)
      ]);
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'delete', '/api/groups', done);
    });

    it('should remove the groups if they are not sent in an array', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).delete('/api/groups'));
        const groupIds = {
          Ids: groupA._id
        };

        req.send(groupIds).expect(200).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should remove the groups if they are sent as array', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).delete('/api/groups'));
        const groupIds = {
          Ids: [groupA._id, groupB._id]
        };

        req.send(groupIds).expect(200).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });
  });

  describe('GET /api/groups/:groupId', function() {
    let groupInMongo;

    beforeEach(function(done) {
      lib.group.create(group).then(function(mongoResult) {
        groupInMongo = mongoResult;

        done();
      }, done);
    });

    it('should return 500 if the id is not an ObjectId', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).get('/api/groups/pipoID'));

        req.expect(500).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 404 if id is not the id of an existing group', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).get('/api/groups/' + user._id));

        req.expect(404).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'get', '/api/groups/' + groupInMongo._id, done);
    });

    it('should return the group', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).get('/api/groups/' + groupInMongo._id));

        req.expect(200).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.shallowDeepEqual(group);

          done();
        });
      });
    });
  });

  describe('PUT /api/groups/:groupId', function() {
    let groupInMongo;

    beforeEach(function(done) {
      lib.group.create(group).then(function(mongoResult) {
        groupInMongo = mongoResult;

        done();
      }, done);
    });

    it('should return 500 if the id is not an ObjectId', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).put('/api/groups/pipoID'));

        req.expect(500).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 404 if id is not the id of an existing group', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).put('/api/groups/' + user._id));

        req.expect(404).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'put', '/api/groups/' + groupInMongo._id, done);
    });

    it('should update the group', function(done) {
      const newGroup = {
        name: 'lintunsi',
        preferred_contact: 'aymen',
        address: 'tunis',
        is_active: false,
        members: []
      };

      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }

        const req = requestAsMember(request(app).put('/api/groups/' + groupInMongo._id));

        req.send(newGroup).expect(200).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.shallowDeepEqual(newGroup);

          done();
        });
      });
    });
  });

  describe('DELETE /api/groups/:groupId', function() {
    let groupInMongo;

    beforeEach(function(done) {
      this.helpers.modules.current.lib.lib.group.create(group).then(function(mongoResult) {
        groupInMongo = mongoResult;

        done();
      }, done);
    });

    it('should return 500 if the id is not an ObjectId', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/groups/pipoID'));

        req.expect(500).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 404 if id is not the id of an existing group', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/groups/' + user._id));

        req.expect(404).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'delete', '/api/groups/' + groupInMongo._id, done);
    });

    it('should remove the group', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/groups/' + groupInMongo._id));

        req.expect(204).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });
  });
});
