// { ticketingUserId(ObjectId), contractId(ObjectId), role(String) }
module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;

  const TicketingUserContractSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    contract: { type: mongoose.Schema.ObjectId, required: true, ref: 'Contract' },
    role: { type: String, default: 'viewer' },
    timestamps: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    schemaVersion: { type: Number, default: 1 }
  });

  return mongoose.model('TicketingUserContract', TicketingUserContractSchema);
};
