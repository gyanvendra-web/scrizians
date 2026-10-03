import mongoose, { Schema, model, models } from 'mongoose';

export interface IJob {
  id: string;
  slug?: string;
  dept?: string;
  typeBadge?: string;
  typeKey?: string;
  title: string;
  company?: string;
  companyLogoUrl?: string;
  location?: string;
  experience?: string;
  skills?: any;
  salaryUSD?: string;
  salaryINR?: string;
  rate?: string;
  status?: string;
  applicantsCount?: number;
}

const JobSchema = new Schema<IJob>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, default: '' },
    dept: { type: String, default: 'ENGINEERING' },
    typeBadge: { type: String, default: 'Full Time' },
    typeKey: { type: String, default: 'Full-time' },
    title: { type: String, required: true },
    company: { type: String, default: 'Scriza Client Partner' },
    companyLogoUrl: { type: String, default: '/images/logo.png' },
    location: { type: String, default: 'Remote (India / Global)' },
    experience: { type: String, default: '3+ years' },
    skills: { type: Schema.Types.Mixed, default: [] },
    salaryUSD: { type: String, default: '$25k – $40k' },
    salaryINR: { type: String, default: '₹18,00,000 – ₹30,00,000' },
    rate: { type: String, default: '$30 - $40 / hr' },
    status: { type: String, default: 'Active' },
    applicantsCount: { type: Number, default: 0 }
  },
  { timestamps: false }
);

export const JobModel = (models.Job as mongoose.Model<IJob>) || model<IJob>('Job', JobSchema);
