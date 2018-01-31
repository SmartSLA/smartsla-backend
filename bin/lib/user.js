'use strict';

const emailAddresses = require('email-addresses');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

function validateEmail(email) {
  return emailAddresses.parseOneAddress(email) !== null;
}

function validateEmails(emails) {
  if (!emails || !emails.length) {
    return true;
  }
  let valid = true;

  emails.forEach(function(email) {
    if (!validateEmail(email)) {
      valid = false;
    }
  });

  return valid;
}

function validateAccounts(accounts) {
  return accounts && accounts.length;
}

var UserAccountSchema = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['email', 'oauth'] },
  hosted: { type: Boolean, default: false },
  emails: { type: [String], unique: true, partialFilterExpression: { $type: 'array' }, validate: validateEmails },
  preferredEmailIndex: { type: Number, default: 0 },
  timestamps: {
    creation: { type: Date, default: Date.now }
  },
  data: { type: Mixed }
});

var MemberOfDomainSchema = new mongoose.Schema({
  domain_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  joined_at: { type: Date, default: Date.now },
  status: { type: String, lowercase: true, trim: true }
}, { _id: false });

var UserSchema = new mongoose.Schema({
  firstname: { type: String, trim: true },
  lastname: { type: String, trim: true },
  password: { type: String },
  job_title: { type: String, trim: true },
  service: { type: String, trim: true },
  building_location: { type: String, trim: true },
  office_location: { type: String, trim: true },
  main_phone: { type: String, trim: true },
  description: { type: String, trim: true },
  timestamps: {
    creation: { type: Date, default: Date.now }
  },
  domains: { type: [MemberOfDomainSchema] },
  login: {
    disabled: { type: Boolean, default: false },
    failures: {
      type: [Date]
    },
    success: { type: Date }
  },
  schemaVersion: { type: Number, default: 2 },
  avatars: [ObjectId],
  currentAvatar: ObjectId,
  accounts: { type: [UserAccountSchema], required: true, validate: validateAccounts }
});

UserSchema.virtual('preferredEmail').get(function() {
  return this.accounts
    .filter(function(account) {
      return account.type === 'email';
    })
    .slice() // Because sort mutates the array
    .sort(function(a, b) {
      return b.hosted - a.hosted;
    })
    .reduce(function(foundPreferredEmail, account) {
      return foundPreferredEmail || account.emails[account.preferredEmailIndex];
    }, null);
});

UserSchema.virtual('preferredDomainId').get(function() {
  return this.domains.length ? this.domains[0].domain_id : '';
});

UserSchema.virtual('emails').get(function() {
  var emails = [];

  this.accounts.forEach(function(account) {
    account.emails && account.emails.forEach(function(email) {
      emails.push(email);
    });
  });

  return emails;
});
module.exports = mongoose.model('User', UserSchema);
