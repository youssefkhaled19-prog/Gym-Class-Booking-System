import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  enrolled: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);