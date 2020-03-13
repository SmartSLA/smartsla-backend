'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('The Team model', function() {
  let Team, mongoose;

  beforeEach(function(done) {
    mongoose = this.moduleHelpers.dependencies('db').mongo.mongoose;

    require(this.testEnv.backendPath + '/lib/db/team')(
      this.moduleHelpers.dependencies
    );
    Team = mongoose.model('Team');

    this.connectMongoose(mongoose, done);
  });

  afterEach(function(done) {
    delete mongoose.connection.models.Team;
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveTeam(TeamJson, callback) {
    const MyTeam = new Team(TeamJson);

    return MyTeam.save(callback);
  }

  describe('The Team model', function() {
    it('should store a Team with valid fields', function(done) {
      saveTeam(
        {
          name: 'Team1',
          email: 'Foo'
        },

        err => {
          expect(err).to.not.exist;
          done();
        }
      );
    });

    it('should have a unique name value', function(done) {
      saveTeam(
        {
          name: 'Team1',
          email: 'Foo'
        },

        err => {
          expect(err).to.not.exist;

          const anotherTeam = {
            name: 'Team1',
            email: 'Foo'
          };

          setTimeout(function() {
            saveTeam(anotherTeam, err => {
              expect(err).to.exist;
              expect(err.message).to.contain('duplicate key error');
              done();
            });
          }, 2000);
        }
      );
    });
  });
});
