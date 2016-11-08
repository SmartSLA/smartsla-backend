'use strict';

const request = require('supertest');
const expect = require('chai').expect;

describe('The client API', function() {
  let user, app;
  const password = 'secret';
  const client = {
    name: 'Linagora',
    acronym: 'LIN',
    preferred_contact: 'linagora',
    address: {country: 'Tunisia'},
    is_active: true,
    access_code: '123',
    access_code_hint: 'hint'
  };

  beforeEach(function(done) {
    const self = this;

    this.helpers.modules.initMidway('linagora.esn.ticketing', function(err) {
      if (err) {
        return done(err);
      }
      const ticketApp = require(self.testEnv.backendPath + '/webserver/application')(self.helpers.modules.current.deps);
      const api = require(self.testEnv.backendPath + '/webserver/api')(self.helpers.modules.current.deps, self.helpers.modules.current.lib.lib);

      ticketApp.use(require('body-parser').json());
      ticketApp.use('/api', api);

      app = self.helpers.modules.getWebServer(ticketApp);

      self.helpers.api.applyDomainDeployment('linagora_IT', function(err, models) {
        if (err) {
          return done(err);
        }
        user = models.users[0];

        done();
      });
    });
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(done);
  });

  describe('GET /api/clients', function() {
    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'get', '/api/clients', done);
    });

    it('should return a list of clients', function(done) {
      const self = this;

      this.helpers.modules.current.lib.lib.client.list({}).then(function(clients) {
        self.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
          if (err) {
            return done(err);
          }
          const req = requestAsMember(request(app).get('/api/clients'));

          req.expect(200).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.deep.equal(clients);

            done();
          });
        });
      }, done);
    });
  });

  describe('GET /api/clients/:clientId', function() {
    let clientInMongo;

    beforeEach(function(done) {
      this.helpers.modules.current.lib.lib.client.create(client).then(function(mongoResult) {
        clientInMongo = mongoResult;

        done();
      }, done);
    });

    it('should return 500 if the id is not an ObjectId', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).get('/api/clients/pipoID'));

        req.expect(500).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 404 if id is not the id of an existing client', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).get('/api/clients/' + user._id));

        req.expect(404).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'get', '/api/clients/' + clientInMongo._id, done);
    });

    it('should return the client', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).get('/api/clients/' + clientInMongo._id));

        req.expect(200).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.shallowDeepEqual(client);

          done();
        });
      });
    });
  });

  describe('POST /api/clients', function() {
    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'post', '/api/clients', done);
    });

    it('should create the client', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).post('/api/clients'));

        req.send(client).expect(201).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.shallowDeepEqual(client);

          done();
        });
      });
    });
  });

  describe('PUT /api/clients/:clientId', function() {
    let clientInMongo;

    beforeEach(function(done) {
      this.helpers.modules.current.lib.lib.client.create(client).then(function(mongoResult) {
        clientInMongo = mongoResult;

        done();
      }, done);
    });

    it('should return 500 if the id is not an ObjectId', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).put('/api/clients/pipoID'));

        req.expect(500).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 404 if id is not the id of an existing client', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).put('/api/clients/' + user._id));

        req.expect(404).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'put', '/api/clients/' + clientInMongo._id, done);
    });

    it('should update the client', function(done) {
      const newClient = {
        name: 'Linagora',
        address: 'Tolosa',
        access_code: '123',
        access_code_hint: 'anotherhint'
      };

      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).put('/api/clients/' + clientInMongo._id));

        req.send(newClient).expect(200).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.shallowDeepEqual(newClient);

          done();
        });
      });
    });
  });

  describe('DELETE /api/clients/:clientId', function() {
    let clientInMongo;
    const group = {
      name: 'Ticketing'
    };

    beforeEach(function(done) {
      const self = this;
      let client;

      self.helpers.modules.current.lib.lib.group.create(group).then(function(mongoResult) {
        client = {
          name: 'linagora',
          acronym: 'Tolosa',
          preferred_contact: 'linagora',
          address: {country: 'Tunisia'},
          is_active: true,
          access_code: '123',
          access_code_hint: 'anotherhint',
          groups: [mongoResult._id]
        };

        self.helpers.modules.current.lib.lib.client.create(client).then(function(mongoResult) {
          clientInMongo = mongoResult;

          done();
        }, done);
      });
    });

    it('should return 500 if the id is not an ObjectId', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/clients/pipoID'));

        req.expect(500).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 404 if id is not the id of an existing client', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/clients/' + user._id));

        req.expect(404).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should return 401 if not logged in', function(done) {
      this.helpers.api.requireLogin(app, 'delete', '/api/clients/' + clientInMongo._id, done);
    });

    it('should remove the client', function(done) {
      this.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/clients/' + clientInMongo._id));

        req.expect(204).end(function(err) {
          expect(err).to.not.exist;

          done();
        });
      });
    });

    it('should remove the groups', function(done) {
      const self = this;

      self.helpers.api.loginAsUser(app, user.emails[0], password, function(err, requestAsMember) {
        if (err) {
          return done(err);
        }
        const req = requestAsMember(request(app).delete('/api/clients/' + clientInMongo._id));

        req.expect(204).end(function(err) {
          self.helpers.modules.current.lib.lib.group.get(clientInMongo.groups[0]._id).then(function(mongoResult) {
            expect(mongoResult).to.be.null;
            expect(err).to.not.exist;

            done();
          });
        });
      });
    });
  });
});
