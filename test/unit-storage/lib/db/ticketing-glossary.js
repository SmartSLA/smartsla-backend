'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The TicketingGlossary model', function() {
  let TicketingGlossary, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;

    require(this.testEnv.backendPath + '/lib/db/ticketing-glossary')(this.moduleHelpers.dependencies);
    TicketingGlossary = mongoose.model('TicketingGlossary');

    this.connectMongoose(mongoose, done);
  });

  afterEach(function(done) {
    delete mongoose.connection.models.TicketingGlossary;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveGlossary(glossaryJson, callback) {
    const glossary = new TicketingGlossary(glossaryJson);

    return glossary.save(callback);
  }

  describe('The category field', function() {
    it('should not store the glossary which has invalid category', function(done) {
      saveGlossary({
        word: 'foo',
        category: 'invalid-category'
      }, err => {
        expect(err).to.exist;
        expect(err.errors.category.message).to.equal('Invalid glossary category');
        done();
      });
    });
  });
});
