module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true },
    seq: { type: Number, required: true }
  });

  return mongoose.model('Counter', CounterSchema);
};
