import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  designation: string;
  bio: string;
  imageUrl: string;
  accentColor: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  accentColor: { type: String, default: '#2A7FD4' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
