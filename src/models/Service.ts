import mongoose, { Schema, Document } from 'mongoose';


export interface IService extends Document {
  icon: string;
  title: string;
  description: string;
  tag: string;
  colSpan: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: '' },
  colSpan: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
