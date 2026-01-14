import mongoose, { Schema, Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const GenreSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.models.Genre || mongoose.model<IGenre>('Genre', GenreSchema);