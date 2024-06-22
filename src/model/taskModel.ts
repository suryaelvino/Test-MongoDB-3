import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Task extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  projectId: Types.ObjectId;
}

const taskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
});

taskSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<Task>('Task', taskSchema);
