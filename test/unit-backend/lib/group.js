'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const q = require('q');

describe('The linagora.esn.ticketing group lib', function() {

  let group, deps, logger, modelsMock, ObjectIdMock, modelMethode;

  function dependencies(name) {
    return deps[name];
  }

  beforeEach(function() {
    group = require(this.moduleHelpers.backendPath + '/lib/group');

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
      TicGroup: {
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

  describe('The group list function', function() {
    it('should call Group.find', function(done) {
      const options = {};

      group(dependencies).list(options).then(function() {
        expect(modelsMock.TicGroup.find).to.have.been.calledWith(options);

        done();
      });
    });
  });

  describe('The group create function', function() {
    it('should call Group.create', function(done) {
      const groupMock = {};

      group(dependencies).create(groupMock).then(function() {
        expect(modelsMock.TicGroup.create).to.have.been.calledWith(groupMock);

        done();
      });
    });
  });

  describe('The group get function', function() {
    it('should call Group.findById', function(done) {
      const id = 1;

      group(dependencies).get(id).then(function() {
        expect(modelsMock.TicGroup.findById).to.have.been.calledWith(id);

        done();
      });
    });
  });

  describe('The group update function', function() {
    it('should call Group.findByIdAndUpdate', function(done) {
      const groupId = {
        _id: 1
      };

      const mockGroup = {
        name: 'aymen'
      };

      group(dependencies).update(groupId, mockGroup).then(function() {
        expect(modelsMock.TicGroup.findByIdAndUpdate).to.have.been.calledWith(groupId, {$set: mockGroup}, {new: true});

        done();
      });
    });
  });

  describe('The client remove function', function() {
    it('should call Client.remove', function(done) {
      const id = 1;

      group(dependencies).remove(id).then(function() {
        expect(modelsMock.TicGroup.findByIdAndRemove).to.have.been.calledWith(id);

        done();
      });
    });
  });
});
