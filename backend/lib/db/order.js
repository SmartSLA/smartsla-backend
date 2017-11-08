'use strict';

const { validateOrderType, validateRight } = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const OrderSchema = new mongoose.Schema({
    active: { type: Boolean, default: true },
    number: { type: Number, unique: true },
    contract: { type: Schema.ObjectId, ref: 'Contract', required: true },
    title: { type: String, required: true },
    address: { type: String },
    manager: { type: Schema.ObjectId, ref: 'User' },
    defaultSupportManager: { type: Schema.ObjectId, ref: 'User' },
    defaultSupportTechnician: { type: Schema.ObjectId, ref: 'User' },
    startDate: { type: Date, required: true },
    terminationDate: { type: Date, required: true },
    type: { type: String, validate: [validateOrderType, 'Invalid order type'] },
    description: { type: String },
    permissions: [{
      actor: { type: Schema.ObjectId },
      right: { type: String, validate: [validateRight, 'Invalid order right'] }
    }],
    creation: { type: Date, default: Date.now },
    schemaVersion: {type: Number, default: 1}
  });

  const OrderModel = mongoose.model('Order', OrderSchema);

  OrderSchema.pre('save', function(next) {
    const self = this;

    if (!self.isNew) {
      return next();
    }

    // Get the document which has maximum number
    OrderModel.findOne({}, {}, { sort: { number: -1 } }, (err, order) => {
      if (err) {
        return next(err);
      }

      self.number = order ? order.number + 1 : 1;

      next();
    });
  });

  return OrderModel;
};
