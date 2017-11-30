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

  describe('The demands field', function() {
    it('should not store the contract which has invalid demands', function(done) {
      const demand = {
        demandType: 'r',
        softwareType: 's',
        issueType: 'i'
      };
      const contractJson = {
        title: 'test',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        demands: [
          demand,
          demand
        ]
      };

      saveContract(contractJson, err => {
        expect(err).to.exist;
        expect(err.message).to.equal('Invalid contract demands');
        done();
      });
    });

    it('should store the contract which has valid demands', function(done) {
      const contractJson = {
        title: 'test',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        demands: [
          {
            demandType: 'foo',
            softwareType: 's',
            issueType: 'i'
          },
          {
            demandType: 'bar',
            softwareType: 's',
            issueType: 'i'
          }
        ]
      };

      saveContract(contractJson, (err, savedContract) => {
        expect(err).to.not.exist;
        expect(savedContract.demands[0].demandType).to.equal('foo');
        expect(savedContract.demands[1].demandType).to.equal('bar');
        done();
      });
    });
  });
});
