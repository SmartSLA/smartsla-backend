'use strict';

const chai = require('chai');
const expect = chai.expect;

describe.skip('The order model', function() {
  let Order, ObjectId;

  beforeEach(function(done) {
    this.mongoose = require('mongoose');
    ObjectId = this.mongoose.Types.ObjectId;

    require(this.testEnv.backendPath + '/lib/db/order')(this.moduleHelpers.dependencies);
    Order = this.mongoose.model('Order');

    this.connectMongoose(this.mongoose, done);
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase(err => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  function saveOrder(orderJson, callback) {
    const order = new Order(orderJson);

    return order.save(callback);
  }

  describe('The number field', function() {
    it('should be set to 1 if there is no order in database', function(done) {
      const orderJson = {
        title: 'test',
        contract: new ObjectId(),
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP'
      };

      saveOrder(orderJson, (err, savedOrder) => {
        if (err) {
          done(err);
        }

        expect(savedOrder.number).to.equal(1);
        done();
      });
    });

    it('should increase automatically', function(done) {
      const orderJson = {
        title: 'test',
        contract: new ObjectId(),
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP'
      };

      saveOrder(orderJson, err => {
        if (err) {
          done(err);
        }

        saveOrder(orderJson, (err, savedOrder) => {
          if (err) {
            done(err);
          }

          expect(savedOrder.number).to.equal(2);
          done();
        });
      });
    });
  });

  describe('The permissions field', function() {
    it('should not store the order which has invalid permissions', function(done) {
      const orderJson = {
        title: 'test',
        contract: new ObjectId(),
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP',
        permissions: {
          actor: new ObjectId(),
          right: 'wrong value'
        }
      };

      saveOrder(orderJson, err => {
        expect(err).to.exist;
        expect(err.errors['permissions.0.right'].message).to.equal('Invalid order right');
        done();
      });
    });

    it('should store the order which has valid permissions', function(done) {
      const right = 'submit';
      const orderJson = {
        title: 'test',
        contract: new ObjectId(),
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'USP',
        permissions: {
          actor: new ObjectId(),
          right
        }
      };

      saveOrder(orderJson, (err, savedOrder) => {
        expect(err).to.not.exist;
        expect(savedOrder.permissions[0].right).to.equal(right);
        done();
      });
    });
  });

  describe('The type field', function() {
    it('should not store the order which has invalid type', function(done) {
      const orderJson = {
        title: 'test',
        contract: new ObjectId(),
        startDate: new Date(),
        terminationDate: new Date(),
        type: 'invalid type'
      };

      saveOrder(orderJson, err => {
        expect(err).to.exist;
        expect(err.errors.type.message).to.equal('Invalid order type');
        done();
      });
    });

    it('should store the order which has valid type', function(done) {
      const type = 'USP';
      const orderJson = {
        title: 'test',
        contract: new ObjectId(),
        startDate: new Date(),
        terminationDate: new Date(),
        type
      };

      saveOrder(orderJson, err => {
        if (err) {
          done(err);
        }

        saveOrder(orderJson, (err, savedOrder) => {
          if (err) {
            done(err);
          }

          expect(savedOrder.type).to.equal(type);
          done();
        });
      });
    });
  });
});
