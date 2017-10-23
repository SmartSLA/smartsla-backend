'use strict';

const q = require('q');
const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
const mongoose = require('mongoose');

describe('The order module', function() {
  let ObjectId, moduleHelpers;
  let order, orderId, contractId;
  let findByIdAndRemoveMock;

  beforeEach(function() {
    moduleHelpers = this.moduleHelpers;
    ObjectId = mongoose.Types.ObjectId;
    orderId = new ObjectId();
    contractId = new ObjectId();
    findByIdAndRemoveMock = sinon.spy(() => ({ exec: () => q.when() }));

    function Order(order) {
      this.title = order.title;
      this.contract = order.contract;
    }

    Order.create = order => {
      order._id = orderId;

      return q.when(order);
    };

    Order.findByIdAndRemove = findByIdAndRemoveMock;

    moduleHelpers.mockModels({
      Order
    });

    order = {
      title: 'order1',
      contract: contractId
    };
  });

  const getModule = () => require(moduleHelpers.backendPath + '/lib/order')(moduleHelpers.dependencies);

  it('should remove the order if failed to update contract', function(done) {
    const error = new Error('something wrong');
    const addOrderMock = sinon.stub().returns(q.reject(error));

    mockery.registerMock('./contract', () => ({ addOrder: addOrderMock }));

    getModule().create(order)
      .catch(err => {
        expect(err.message).to.equal(error.message);
        expect(addOrderMock).to.have.been.calledWith(contractId);
        expect(findByIdAndRemoveMock).to.have.been.calledWith(orderId);

        done();
      });
  });
});
