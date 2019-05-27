'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const SoftwareSchema = new mongoose.Schema({
    private: { type: Boolean, default: false },
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    description: { type: String },
    licence: { type: String },
    technology: { type: String },
    group: { type: String },
    logo: mongoose.Schema.Types.ObjectId,
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  const SoftwareModel = mongoose.model('Software', SoftwareSchema);

  SoftwareSchema.pre('save', function(next) {
    const self = this;

    // Get the document by name insensitive lowercase and uppercase
    SoftwareModel.findOne({ name: new RegExp(`^${self.name}$`, 'i') }, (err, software) => {
      if (err) {
        return next(err);
      }

      if (!self.isNew && software._id.toString() !== self._id.toString()) {
        return next(new Error('name is taken'));
      }

      if (self.isNew && software) {
        return next(new Error('name is taken'));
      }

      next();
    });
  });

  return mongoose.model('Software', SoftwareSchema);
};
