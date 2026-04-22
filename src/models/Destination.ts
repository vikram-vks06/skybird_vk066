import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  city: string;
  country: string;
  tagline: string;
  imageUrl: string;
  accentColor: string;
  tag: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const DestinationSchema = new Schema<IDestination>({
  city: { type: String, required: true },
  country: { type: String, required: true },
  tagline: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  accentColor: { type: String, default: '#E8A020' },
  tag: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);
