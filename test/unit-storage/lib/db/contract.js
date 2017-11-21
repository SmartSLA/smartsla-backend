'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The contract model', function() {
  let Contract, ObjectId, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;
    ObjectId = mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/contract')(this.moduleHelpers.dependencies);
    Contract = mongoose.model('Contract');

    this.connectMongoose(mongoose, done);
  });

  afterEach(function(done) {
    delete mongoose.connection.models.Contract;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveContract(contractJson, callback) {
    const contract = new Contract(contractJson);

    return contract.save(callback);
  }

  describe('The requests field', function() {
    it('should not store the contract which has invalid requests', function(done) {
      const request = {
        requestType: 'r',
        softwareType: 's',
        issueType: 'i'
      };
      const contractJson = {
        title: 'test',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        requests: [
          request,
          request
        ]
      };

      saveContract(contractJson, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('Invalid contract requests');
        done();
      });
    });

    it('should store the contract which has valid requests', function(done) {
      const contractJson = {
        title: 'test',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        requests: [
          {
            requestType: 'foo',
            softwareType: 's',
            issueType: 'i'
          },
          {
            requestType: 'bar',
            softwareType: 's',
            issueType: 'i'
          }
        ]
      };

      saveContract(contractJson, (err, savedContract) => {
        expect(err).to.not.exist;
        expect(savedContract.requests[0].requestType).to.equal('foo');
        expect(savedContract.requests[1].requestType).to.equal('bar');
        done();
      });
    });
  });
});
