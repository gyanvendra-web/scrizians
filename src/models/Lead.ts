import mongoose, { Schema, model, models } from 'mongoose';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceRequested?: string;
  scrizianIdReferenced?: string;
  stage?: string;
  message?: string;
  createdAt?: string;
}

const LeadSchema = new Schema<ILead>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    serviceRequested: { type: String, default: 'General Requirement' },
    scrizianIdReferenced: { type: String, default: 'N/A' },
    stage: { type: String, default: 'New Inbound Lead' },
    message: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
  },
  { timestamps: false }
);

export const LeadModel = (models.Lead as mongoose.Model<ILead>) || model<ILead>('Lead', LeadSchema);
