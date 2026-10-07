import mongoose, { Schema, model, models } from 'mongoose';

export interface IInsight {
  id: string;
  cat?: string;
  category?: string;
  filterKey?: string;
  title: string;
  excerpt?: string;
  content?: string;
  meta?: string;
  author?: string;
  publishedDate?: string;
  readTime?: string;
  coverImageUrl?: string;
  image?: string;
  status?: string;
}

const InsightSchema = new Schema<IInsight>(
  {
    id: { type: String, required: true, unique: true },
    cat: { type: String, default: 'HIRING GUIDES' },
    category: { type: String, default: 'Hiring Guides' },
    filterKey: { type: String, default: 'Hiring Guides' },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    meta: { type: String, default: '' },
    author: { type: String, default: 'Scrizians Editorial' },
    publishedDate: { type: String, default: 'Just now' },
    readTime: { type: String, default: '5 min read' },
    coverImageUrl: { type: String, default: '/images/logo.png' },
    image: { type: String, default: '/images/logo.png' },
    status: { type: String, default: 'Published' }
  },
  { timestamps: false }
);

export const InsightModel = (models.Insight as mongoose.Model<IInsight>) || model<IInsight>('Insight', InsightSchema);
