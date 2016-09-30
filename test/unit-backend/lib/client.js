'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const q = require('q');

describe('The linagora.esn.ticketing client lib', function() {

  let client, deps, logger, modelsMock, ObjectIdMock, modelMethode;

  function dependencies(name) {
    return deps[name];
  }

  beforeEach(function() {
    client = require(this.moduleHelpers.backendPath + '/lib/client');

    logger = {
      error: console.warn,
      info: console.warn,
      debug: console.warn
    };

    modelMethode = sinon.spy(function() {
      return {
        exec() {
          return q.when();
        }
      };
    });

    modelsMock = {
      TicClient: {
        create: sinon.spy(function() {
          return q.when();
        }),
        findById: modelMethode,
        find: modelMethode,
        findByIdAndUpdate: modelMethode,
        findByIdAndRemove: modelMethode
      }
    };

    deps = {
      logger: logger,
      db: {
        mongo: {
          mongoose: {
            model: function(type) {
              return modelsMock[type];
            },
            Types: {
              ObjectId: function() {
                return ObjectIdMock.apply(this, arguments);
              }
            }
          }
        }
      }
    };
  });

  describe('The client list function', function() {
    it('should call Client.find', function(done) {
      const options = {};

      client(dependencies).list(options).then(function() {
        expect(modelsMock.TicClient.find).to.have.been.calledWith(options);

        done();
      });
    });
  });

  describe('The client create function', function() {
    it('should call Client.create', function(done) {
      const mockClient = {};

      client(dependencies).create(mockClient).then(() => {
        expect(modelsMock.TicClient.create).to.have.been.calledWith(mockClient);

        done();
      });
    });
  });

  describe('The client get function', function() {
    it('should call Client.findById', function(done) {
      const clientId = 1;

      client(dependencies).get(clientId).then(function() {
        expect(modelsMock.TicClient.findById).to.have.been.calledWith(clientId);

        done();
      });
    });
  });

  describe('The client update function', function() {
    it('should call Client.findByIdAndUpdate', function(done) {
      const clientId = {
        _id: 1
      };

      const mockClient = {
        name: 'linagora'
      };

      client(dependencies).update(clientId, mockClient).then(function() {
        expect(modelsMock.TicClient.findByIdAndUpdate).to.have.been.calledWith(clientId, {$set: mockClient}, {new: true});

        done();
      });
    });
  });

  describe('The client remove function', function() {
    it('should call Client.remove', function(done) {
      const clientId = 1;

      client(dependencies).remove(clientId).then(function() {
        expect(modelsMock.TicClient.findByIdAndRemove).to.have.been.calledWith(clientId);

        done();
      });
    });
  });
});
