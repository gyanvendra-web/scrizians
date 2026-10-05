import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'talent' | 'client' | 'contributor' | 'candidate';
  scrizianId?: string;
  company?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'talent', 'client', 'contributor', 'candidate'],
      required: true,
    },
    scrizianId: { type: String, default: 'N/A' },
    company: { type: String, default: 'Scrizians Platform' },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
