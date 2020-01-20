'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const LinkSchema = new Schema({
    name: { type: String },
    url: { type: String }
  }, { id: false });

  const ContributionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    software: { type: mongoose.Schema.ObjectId, ref: 'Software', required: true },
    author: { type: mongoose.Schema.ObjectId, ref: 'TicketingUser', required: true },
    type: { type: String},
    version: { type: String },
    fixedInVersion: { type: String },
    staus: { type: String },
    description: { type: String },
    deposedAt: { type: String },
    links: [LinkSchema],
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  return ContributionSchema;
};
