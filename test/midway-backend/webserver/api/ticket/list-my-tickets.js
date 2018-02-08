'use strict';

const request = require('supertest');
const expect = require('chai').expect;

describe('GET /ticketing/api/tickets?scope=mine', function() {
  let app, lib, helpers, apiUrl;
  let admin, supporter, user1, user2, software, contract, organization;
  const password = 'secret';
  const description = 'fooooooooooooooooooooooooooooooooooooooooooooooooo';

  beforeEach(function(done) {
    helpers = this.helpers;
    app = this.app;
    lib = this.lib;
    apiUrl = '/ticketing/api/tickets?scope=mine';

    const fixtures = require('../../../fixtures/deployments');

    helpers.initUsers(fixtures.ticketingUsers())
      .then(createdUsers => {
        admin = createdUsers[0];
        supporter = createdUsers[1];
        user1 = createdUsers[2];
        user2 = createdUsers[3];
        done();
      })
      .catch(err => done(err));
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
      }))
    .then(() =>
      lib.software.create({
        name: 'software1',
        category: 'category1',
        versions: ['1', '2', '3']
      })
      .then(createdSofware => {
        software = createdSofware;
      })
    )
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
        defaultSupportManager: supporter._id,
        startDate: new Date(),
        endDate: new Date(),
        demands: [{
          demandType: 'Info',
          softwareType: 'Normal',
          issueType: 'Blocking'
        }],
        software: [{
          template: software._id,
          type: 'Normal',
          versions: ['1', '2']
        }]
      })
      .then(createdContract => (contract = createdContract))
    )
    .then(() => done())
    .catch(err => done(err));
  });

  afterEach(function(done) {
    helpers.mongo.dropDatabase(err => done(err));
  });

  it('should respond 401 if not logged in', function(done) {
    helpers.api.requireLogin(app, 'get', apiUrl, done);
  });

  it('should respond 200 with list my tickets', function(done) {
    const ticketAJSON = {
      state: 'New',
      contract: contract._id,
      title: 'ticket A',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: supporter._id,
      supportManager: admin._id
    };
    const ticketBJSON = {
      state: 'In progress',
      contract: contract._id,
      title: 'ticket B',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportManager: supporter._id
    };
    const ticketCJSON = {
      state: 'Awaiting',
      contract: contract._id,
      title: 'ticket C',
      demandType: 'Info',
      severity: 'Blocking',
      software: {
        template: contract.software[0].template,
        criticality: contract.software[0].type,
        version: '1'
      },
      description,
      requester: user1._id,
      supportTechnicians: [supporter._id],
      supportManager: admin._id
    };

      lib.ticket.create(ticketAJSON)
        .then(() => lib.ticket.create(ticketBJSON))
        .then(() => lib.ticket.create(ticketCJSON))
        .then(() =>
          helpers.api.loginAsUser(app, supporter.emails[0], password, helpers.callbacks.noErrorAnd(requestAsMember => {
            const req = requestAsMember(request(app).get(apiUrl));

            req.expect(200)
            .end(helpers.callbacks.noErrorAnd(res => {
              expect(res.headers['x-esn-items-count']).to.equal('3');
              expect(res.body[0].supportTechnicians[0]._id).to.equal(String(supporter._id));
              expect(res.body[1].supportManager._id).to.equal(String(supporter._id));
              expect(res.body[2].requester).to.equal(String(supporter._id));
              done();
            }));
          }))
        )
        .catch(err => done(err));
  });
});
