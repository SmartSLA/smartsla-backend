'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;
  const CounterModel = mongoose.model('Counter');

  const LinkSchema = new Schema({
    name: { type: String },
    url: { type: String }
  }, { _id: false });

  const StatusSchema = new Schema({
    develop: { type: Date, default: null },
    reversed: { type: Date, default: null },
    published: { type: Date, default: null },
    integrated: { type: Date, default: null },
    rejected: { type: Date, default: null }
  }, { _id: false });

  const ContributionSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    software: { type: mongoose.Schema.ObjectId, ref: 'Software', required: true },
    author: { type: mongoose.Schema.ObjectId, ref: 'TicketingUser', required: true },
    type: { type: String},
    version: { type: String },
    fixedInVersion: { type: String },
    status: { type: StatusSchema, default: StatusSchema},
    description: { type: String },
    deposedAt: { type: String },
    links: [LinkSchema],
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  ContributionSchema.pre('save', function(next) {
    const self = this;

    if (this.isNew) {
      CounterModel.findOneAndUpdate({ _id: 'contribution'}, { $inc: { seq: 1 } }, { upsert: true, new: true },
      (err, counter) => {
        if (err) {
          return next(err);
        }
        self._id = counter.seq;

        next();
      });
    } else {
      next();
    }
  });

  return ContributionSchema;
};
