import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  quote: string;
  imageUrl: string;
  accentColor: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  quote: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  accentColor: { type: String, default: '#E8A020' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
