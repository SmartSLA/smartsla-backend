'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    motto: { type: String },
    email: { type: String, required: true },
    manager: mongoose.Schema.Types.ObjectId,
    alertSystemActive: { type: Boolean, default: false },
    hash: { type: String },
    testAlertSystemActive: { type: Boolean, default: false },
    alertStartHour: { type: String },
    autoAlertStartHour: { type: String },
    contracts: [mongoose.Schema.Types.ObjectId],
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  const TeamModel = mongoose.model('Team', TeamSchema);

  TeamSchema.pre('save', function(next) {
    const self = this;

    // Get the document by name insensitive lowercase and uppercase
    TeamModel.findOne({ name: new RegExp(`^${self.name}$`, 'i') }, (err, team) => {
      if (err) {
        return next(err);
      }

      if (!self.isNew && team._id.toString() !== self._id.toString()) {
        return next(new Error('name is taken'));
      }

      if (self.isNew && team) {
        return next(new Error('name is taken'));
      }

      next();
    });
  });

  return mongoose.model('Team', TeamSchema);
};
