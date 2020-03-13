'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The Contribution model', function() {
  let Contribution, ObjectId, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;
    ObjectId = mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/counter')(
      this.moduleHelpers.dependencies
    );
    require(this.testEnv.backendPath + '/lib/db/contribution')(
      this.moduleHelpers.dependencies
    );
    Contribution = mongoose.model('Contribution');

    this.connectMongoose(mongoose, done);
  });

  afterEach(function(done) {
    delete mongoose.connection.models.Contribution;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveContribution(contributionJson, callback) {
    const MyContribution = new Contribution(contributionJson);

    return MyContribution.save(callback);
  }

  describe('The Contribution model', function() {
    it('should store a Contribution with valid fields', function(done) {
      saveContribution(
        {
          name: 'Foo',
          software: new ObjectId(),
          author: new ObjectId()
        },

        err => {
          expect(err).to.not.exist;
          done();
        }
      );
    });
  });
});
