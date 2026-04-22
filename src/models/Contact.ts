import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  destination: string;
  travelers: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  fullName: { type: String, required: true },
  company: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  destination: { type: String, default: '' },
  travelers: { type: String, default: '' },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
