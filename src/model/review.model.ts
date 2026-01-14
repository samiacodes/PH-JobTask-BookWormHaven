import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  book: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
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
  text: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);