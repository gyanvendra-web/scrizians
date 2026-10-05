import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplication extends Document {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  scrizianId?: string;
  resumeUrl: string;
  status: 'Received' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, required: true },
    scrizianId: { type: String, default: 'N/A' },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['Received', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
      default: 'Received',
    },
  },
  { timestamps: true }
);

export const ApplicationModel: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
