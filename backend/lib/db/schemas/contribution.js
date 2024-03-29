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
    author: { type: String },
    type: { type: String},
    version: { type: String },
    fixedInVersion: { type: String },
    status: { type: StatusSchema, default: StatusSchema},
    description: { type: String },
    deposedAt: { type: String },
    links: [LinkSchema],
    timestamps: {
      creation: { type: Date, default: Date.now },
      updatedAt: { type: Date }
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

  ContributionSchema.pre('update', function(next) {
    const self = this;
    const set = self._update.$set || {};

    if (set.timestamps) {
      set.timestamps.updatedAt = Date.now();
    } else {
      self._update.$set = Object.assign(set, { 'timestamps.updatedAt': Date.now() });
    }

    next();
  });

  return ContributionSchema;
};
