'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The contract model', function() {
  let Contract, ObjectId;

  beforeEach(function(done) {
    this.mongoose = require('mongoose');
    ObjectId = this.mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/contract')(this.moduleHelpers.dependencies);
    this.testEnv.writeDBConfigFile();
    Contract = this.mongoose.model('Contract');

    this.connectMongoose(this.mongoose, done);
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(done);
  });

  function saveContract(contractJson, callback) {
    const contract = new Contract(contractJson);

    return contract.save(callback);
  }

  describe('The permissions field', function() {
    it('should not store the contract which has invalid permissions', function(done) {
      const contractJson = {
        title: 'test',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        permissions: {
          actor: new ObjectId(),
          right: 'wrong value'
        }
      };

      saveContract(contractJson, err => {
        expect(err).to.exist;
        expect(err.errors['permissions.0.right'].message).to.equal('Invalid contract right');
        done();
      });
    });

    it('should store the contract which has valid permissions', function(done) {
      const right = 'submit';
      const contractJson = {
        title: 'test',
        organization: new ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        permissions: {
          actor: new ObjectId(),
          right
        }
      };

      saveContract(contractJson, (err, savedContract) => {
        expect(err).to.not.exist;
        expect(savedContract.permissions[0].right).to.equal(right);
        done();
      });
    });
  });
});
