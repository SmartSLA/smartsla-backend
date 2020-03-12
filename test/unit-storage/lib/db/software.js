'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The sofware model', function() {
  let Software, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;

    require(this.testEnv.backendPath + '/lib/db/software')(
      this.moduleHelpers.dependencies
    );
    Software = mongoose.model('Software');

    this.connectMongoose(mongoose, done);
  });

  afterEach(function(done) {
    delete mongoose.connection.models.Software;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveSoftware(sofwareJson, callback) {
    const sofware = new Software(sofwareJson);

    return sofware.save(callback);
  }

  describe('The name field', function() {
    it('should not store a sofware which has an already taken name', function(done) {
      saveSoftware(
        {
          name: 'foo',
          category: 'bar',
          versions: ['1']
        },
        err => {
          expect(err).to.not.exist;

          const software = {
            name: 'foo',
            category: 'bar',
            versions: ['1']
          };

          setTimeout(function() {
            saveSoftware(software, err => {
              expect(err).to.exist;
              expect(err.message).to.contain('duplicate key error');
              done();
            });
          }, 2000);
        }
      );
    });

    /* it('should store the sofware which has name is taken by itself', function(done) {
      saveSoftware({
        name: 'foo',
        category: 'bar',
        versions: ['1']
      }, (err, createdSofware) => {
        expect(err).to.not.exist;
        const software = Object.assign(createdSofware, { category: 'bazzz' });

        saveSoftware(software, (err, storedSoftware) => {
          expect(err).to.not.exist;
          expect(storedSoftware.category).to.equal(software.category);
          done();
        });
      });
    }); */
  });
});
