import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  link: { type: String, optional: true },
  completed: { type: Boolean, default: false }, // Add completed field
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);