import mongoose from 'mongoose';

const CreditSchema = new mongoose.Schema({
  personName: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Credit', CreditSchema);