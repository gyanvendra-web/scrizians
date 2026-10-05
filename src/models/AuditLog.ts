import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  id: string;
  action: string;
  category: string;
  actorEmail: string;
  details: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    id: { type: String, required: true, unique: true },
    action: { type: String, required: true },
    category: { type: String, required: true },
    actorEmail: { type: String, required: true },
    details: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

export const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
