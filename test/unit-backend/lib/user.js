'use strict';

const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
const mongoose = require('mongoose');

describe('The user lib', function() {
  let ObjectId, moduleHelpers;
  let user, userId, userRole;
  let findByIdAndRemoveMock;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    ObjectId = mongoose.Types.ObjectId;
    userId = new ObjectId();

    moduleHelpers.addDep('pubsub', {
      local: {}
    });
    moduleHelpers.addDep('coreUser', {
      recordUser: (user, callback) => {
        user._id = userId;

        callback(null, user);
      }
    });

    findByIdAndRemoveMock = sinon.spy(() => ({ exec: () => q.when() }));

    function User(user) {
      this.email = user.email;
    }

    User.findByIdAndRemove = findByIdAndRemoveMock;

    moduleHelpers.mockModels({
      User
    });

    user = {
      email: 'foo@bar.org'
    };
    userRole = {
      user: userId,
      role: 'user'
    };
  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/user')(moduleHelpers.dependencies);

  it('should remove the user if failed to create user role', function(done) {
    const error = new Error('something wrong');
    const createUserRoleMock = sinon.stub().returns(q.reject(error));

    mockery.registerMock('./ticketing-user-role', () => ({ create: createUserRoleMock }));

    getModule().create(user)
      .catch(err => {
        expect(err.message).to.equal(error.message);
        expect(createUserRoleMock).to.have.been.calledWith(userRole);
        expect(findByIdAndRemoveMock).to.have.been.calledWith(userId);

        done();
      });
  });
});
