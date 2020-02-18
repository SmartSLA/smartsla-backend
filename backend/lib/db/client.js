'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String },
    active: { type: Boolean, default: true },
    logo: mongoose.Schema.Types.ObjectId,
    accessCode: { type: String },
    accessHelp: { type: String },
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  const ClientModel = mongoose.model('Client', ClientSchema);

  ClientSchema.pre('save', function(next) {
    const self = this;

    // Get the document by name insensitive lowercase and uppercase
    ClientModel.findOne({ name: new RegExp(`^${self.name}$`, 'i') }, (err, team) => {
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

  return mongoose.model('Client', ClientSchema);
};
