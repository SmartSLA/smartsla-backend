'use strict';

const request = require('supertest');
const Q = require('q');
const path = require('path');
const expect = require('chai').expect;
const MODULE_NAME = 'linagora.esn.ticketing';

describe('The POST /api/contracts/:id/demands', function() {
  let app, lib, helpers, esIntervalIndex, apiURL;
  let user1, user2, demand, contract, software, organization;
  let demandGlossary, softwareGlossary, issueGlossary;
  const password = 'secret';

  beforeEach(function(done) {
    const self = this;

    helpers = self.helpers;
    esIntervalIndex = self.testEnv.serversConfig.elasticsearch.interval_index;

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

        lib.start(err => {
          if (err) {
            done(err);
          }

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
              name: 'software',
              category: 'category',
              versions: ['1']
            })
            .then(createdSofware => (software = createdSofware)))
          .then(() =>
            lib.organization.create({
              shortName: 'organization'
            })
            .then(createOrganization => (organization = createOrganization)))
          .then(() => done())
          .catch(err => done(err));
        });
      });
    });
  });

  beforeEach(function(done) {
    demandGlossary = {
      word: 'information',
      category: 'Demand type'
    };

    softwareGlossary = {
      word: 'browser',
      category: 'Software type'
    };

    issueGlossary = {
      word: 'Non blocking',
      category: 'Issue type'
    };

    Q.all([
      lib.glossary.create(demandGlossary),
      lib.glossary.create(softwareGlossary),
      lib.glossary.create(issueGlossary)
    ]).then(() => done())
      .catch(err => done(err));
  });

  beforeEach(function(done) {
    demand = {
      demandType: demandGlossary.word,
      softwareType: softwareGlossary.word,
      issueType: issueGlossary.word
    };

    lib.contract.create({
      title: 'contract',
      organization: organization._id,
      startDate: new Date(),
      endDate: new Date(),
      demands: [demand],
      software: [{
        template: software._id,
        type: 'normal',
        versions: software.versions
      }]
    })
    .then(createdContract => {
      contract = createdContract;
      apiURL = `/api/contracts/${contract._id}/demands`;
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

  it('should respond 400 if there is no demandType is provided', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({});
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Demand type is required' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if demandType does not exist in glossary', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        demandType: 'wrong_value'
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Demand type is unavailable' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if softwareType does not exist in glossary', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        demandType: demandGlossary.word,
        softwareType: 'wrong_value'
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software type is unavailable' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if issueType does not exist in glossary', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        demandType: demandGlossary.word,
        issueType: 'wrong_value'
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Issue type is unavailable' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if softwareType and issueType do not exist in glossary', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        demandType: demandGlossary.word,
        softwareType: 'wrong_value',
        issueType: 'wrong_value'
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Software type, Issue type are unavailable' }
          });
          done();
        }));
    }));
  });

  it('should respond 400 if demand already exists', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        demandType: demand.demandType,
        softwareType: demand.softwareType,
        issueType: demand.issueType
      });
      req.expect(400)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 400, message: 'Bad Request', details: 'Demand already exists' }
          });
          done();
        }));
    }));
  });

  it('should respond 204 if success to add demand for contract', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).post(apiURL));

      req.send({
        demandType: demandGlossary.word
      });
      req.expect(204)
        .end(helpers.callbacks.noErrorAnd(() => {
          lib.contract.getById(contract._id)
            .then(updatedContract => {
              expect(updatedContract.demands.length).to.equal(2);
              expect(updatedContract.demands[1].demandType).to.equal(demandGlossary.word);

              setTimeout(function() {
                lib.contract.search({
                  search: contract.title
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
            });
        }));
    }));
  });
});
