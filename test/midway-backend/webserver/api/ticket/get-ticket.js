'use strict';

const request = require('supertest');
const path = require('path');
const expect = require('chai').expect;

describe('GET /ticketing/api/tickets/:id', function() {
  const API_PATH = '/ticketing/api/tickets';
  let app, lib, helpers, ObjectId;
  let user1, user2, organization, demand, software, contract, ticket;
  const password = 'secret';
  const description = 'fooooooooooooooooooooooooooooooooooooooooooooooooo';

  beforeEach(function(done) {
    helpers = this.helpers;
    app = this.app;
    lib = this.lib;
    ObjectId = this.testEnv.core.db.mongo.mongoose.Types.ObjectId;

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
      })
    )
    .then(() => done())
    .catch(err => done(err));
  });

  beforeEach(function(done) {
    demand = {
      demandType: 'Info',
      softwareType: 'Normal',
      issueType: 'Blocking'
    };

    lib.software.create({
      name: 'software1',
      category: 'category1',
      versions: ['1', '2', '3']
    })
    .then(createdSofware => { software = createdSofware; })
    .then(() =>
      lib.organization.create({
        shortName: 'organization'
      })
      .then(createOrganization => (organization = createOrganization))
    )
    .then(() =>
      lib.contract.create({
        title: 'contract',
        organization: organization._id,
        defaultSupportManager: user1._id,
        startDate: new Date(),
        endDate: new Date(),
        demands: [demand],
        software: [{
          template: software._id,
          type: demand.softwareType,
          versions: ['1', '2']
        }]
      })
      .then(createdContract => (contract = createdContract))
    )
    .then(() =>
      lib.ticket.create({
        contract: contract._id,
        title: 'ticket 1',
        demandType: demand.demandType,
        severity: demand.issueType,
        software: {
          template: software._id,
          criticality: demand.softwareType,
          version: software.versions[0]
        },
        description,
        requester: user1._id,
        supportManager: user1._id,
        supportTechnicians: [user1._id]
      })
      .then(createdTicket => {
        ticket = createdTicket;
        done();
      })
    )
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  const getObjectFromModel = document => JSON.parse(JSON.stringify(document)); // Because model object use original type like Bson, Date

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', `${API_PATH}/${ticket._id}`, done);
  });

  it('should respond 403 if user is not an administrator', function(done) {
    helpers.api.loginAsUser(app, user2.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`${API_PATH}/${ticket._id}`));

      req.expect(403)
        .end(helpers.callbacks.noErrorAnd(res => {
          expect(res.body).to.deep.equal({
            error: { code: 403, message: 'Forbidden', details: 'User is not the administrator' }
          });
          done();
        }));
    }));
  });

  it('should respond 404 if ticket ID is not valid ', function(done) {
    this.helpers.api.loginAsUser(app, user1.emails[0], password, (err, requestAsMember) => {
      expect(err).to.not.exist;
      requestAsMember(request(app).get(`${API_PATH}/123`))
        .expect(404)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Ticket not found' }
          });
          done();
        });
    });
  });

  it('should respond 404 if ticket is not found', function(done) {
    this.helpers.api.loginAsUser(app, user1.emails[0], password, (err, requestAsMember) => {
      expect(err).to.not.exist;
      requestAsMember(request(app).get(`${API_PATH}/${new ObjectId()}`))
        .expect(404)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.deep.equal({
            error: { code: 404, message: 'Not Found', details: 'Ticket not found' }
          });
          done();
        });
    });
  });

  it('should respond 200 with ticket object which contains populations info', function(done) {
    helpers.api.loginAsUser(app, user1.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
      const req = requestAsMember(request(app).get(`${API_PATH}/${ticket._id}`));

      req.expect(200)
        .end(helpers.callbacks.noErrorAnd(res => {
          const expectResult = Object.assign(getObjectFromModel(ticket), {
            contract: {
              _id: contract._id,
              title: contract.title,
              organization: {
                _id: organization._id,
                shortName: organization.shortName
              },
              demands: contract.demands
            },
            software: {
              template: {
                _id: software._id,
                name: software.name
              },
              criticality: demand.softwareType,
              version: software.versions[0]
            },
            requester: {
              _id: user1._id,
              firstname: user1.firstname,
              lastname: user1.lastname
            },
            supportManager: {
              _id: user1._id,
              firstname: user1.firstname,
              lastname: user1.lastname
            },
            supportTechnicians: [{
              _id: user1._id,
              firstname: user1.firstname,
              lastname: user1.lastname
            }]
          });

          expect(res.body).to.shallowDeepEqual(getObjectFromModel(expectResult));
          done();
        }));
    }));
  });
});
