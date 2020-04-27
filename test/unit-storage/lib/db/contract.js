'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The Contract model', function() {
  let Contract, ObjectId, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;
    ObjectId = mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/ticketing-user-contract')(
      this.moduleHelpers.dependencies
    );
    require(this.testEnv.backendPath + '/lib/db/contract')(
      this.moduleHelpers.dependencies
      );
      Contract = mongoose.model('Contract');

      this.connectMongoose(mongoose, done);
    });

  afterEach(function(done) {
    delete mongoose.connection.models.Contract;
    delete mongoose.connection.models.TicketingUserContract;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveContract(ContractJson, callback) {
    const MyContract = new Contract(ContractJson);

    return MyContract.save(callback);
  }

  describe('The Contract model', function() {
    it('should store a contract with valid fields', function(done) {
      saveContract(
        {
          endDate: '2000-12-31',
          client: 'Foo',
          clientId: new ObjectId(),
          name: 'Bar',
          startDate: '2000-01-01',
          timezone: 'Europe/Paris'
        },

        err => {
          expect(err).to.not.exist;
          done();
        }
      );
    });
    it('should not store a contract when name field is missing', function(done) {
      saveContract(
        {
          endDate: '2000-12-31',
          client: 'Bar',
          clientId: new ObjectId(),
          startDate: '2000-01-01',
          timezone: 'Europe/Paris'
        },

        err => {
          expect(err).to.exist;
          expect(err.message).to.contain('`name` is required');
          done();
        }
      );
    });
  });
});
