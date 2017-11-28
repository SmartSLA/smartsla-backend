'use strict';

const { validateGlossaryCategory } = require('../helpers');

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const Schema = mongoose.Schema;

  const TicketingGlossarySchema = new Schema({
    word: { type: String, required: true },
    category: { type: String, required: true, validate: [validateGlossaryCategory, 'Invalid glossary category'] },
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    schemaVersion: { type: Number, default: 1 }
  });

  // uniqueness of pair (word, category)
  TicketingGlossarySchema.index({ word: 1, category: 1 }, { unique: true });

  return mongoose.model('TicketingGlossary', TicketingGlossarySchema);
};
