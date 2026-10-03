import mongoose, { Schema, model, models } from 'mongoose';

export interface ITalent {
  id: string;
  scrizianId: string;
  displayName: string;
  title: string;
  category?: string;
  summary?: string;
  experienceYears?: number;
  skills?: any;
  availability?: string;
  hourlyRateUSD?: number;
  monthlyRateINR?: number;
  relationshipBadge?: string;
  avatarText?: string;
  avatarUrl?: string;
  status?: string;
}

const TalentSchema = new Schema<ITalent>(
  {
    id: { type: String, required: true, unique: true },
    scrizianId: { type: String, required: true },
    displayName: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Full Stack Developers' },
    summary: { type: String, default: '' },
    experienceYears: { type: Number, default: 7 },
    skills: { type: Schema.Types.Mixed, default: [] },
    availability: { type: String, default: 'Available now' },
    hourlyRateUSD: { type: Number, default: 35 },
    monthlyRateINR: { type: Number, default: 190000 },
    relationshipBadge: { type: String, default: 'Verified Scrizian' },
    avatarText: { type: String, default: '00' },
    avatarUrl: { type: String, default: '/images/logo.png' },
    status: { type: String, default: 'Verified' }
  },
  { timestamps: false }
);

export const TalentModel = (models.Talent as mongoose.Model<ITalent>) || model<ITalent>('Talent', TalentSchema);
