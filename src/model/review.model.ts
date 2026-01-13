import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  book: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  book: { 
    type: Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);