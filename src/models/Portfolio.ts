import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolio extends Document {
  id: string;
  scrizianId: string;
  authorRole: string;
  title: string;
  description: string;
  skills: string[];
  coverImageUrl: string;
  isNdaProtected: boolean;
  createdAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    id: { type: String, required: true, unique: true },
    scrizianId: { type: String, required: true },
    authorRole: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    coverImageUrl: { type: String, default: '' },
    isNdaProtected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PortfolioModel: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
