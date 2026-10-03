import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ISeedMarker {
  key: string;
  seededAt?: Date;
}

const SeedMarkerSchema = new Schema<ISeedMarker>(
  {
    key: { type: String, required: true, unique: true },
    seededAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const SeedMarkerModel = (models.SeedMarker as mongoose.Model<ISeedMarker>) || model<ISeedMarker>('SeedMarker', SeedMarkerSchema);
