'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The TicketingUserRole model', function() {
  let TicketingUserRole, ObjectId;

  beforeEach(function(done) {
    this.mongoose = require('mongoose');
    ObjectId = this.mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/ticketing-user-role')(this.moduleHelpers.dependencies);
    this.testEnv.writeDBConfigFile();
    TicketingUserRole = this.mongoose.model('TicketingUserRole');

    this.connectMongoose(this.mongoose, done);
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(done);
  });

  function saveTicketingUserRole(userRoleJson, callback) {
    const userRole = new TicketingUserRole(userRoleJson);

    return userRole.save(callback);
  }

  describe('The role field', function() {
    it('should not save TicketingUserRole if role is invalid', function(done) {
      const userRoleJson = {
        user: new ObjectId(),
        role: 'invalid-role'
      };

      saveTicketingUserRole(userRoleJson, err => {
        expect(err).to.exist;
        expect(err.errors.role.message).to.equal('Invalid TicketingUser role');
        done();
      });
    });

    it('should save TicketingUserRole if all fields are valid', function(done) {
      const userRoleJson = {
        user: new ObjectId(),
        role: 'user'
      };

      saveTicketingUserRole(userRoleJson, (err, savedUserRole) => {
        expect(err).to.not.exist;
        expect(savedUserRole.role).to.equal(userRoleJson.role);
        done();
      });
    });
  });
});
