import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  genre: string[];
  pages: number;
  publishedYear: number;
  isbn?: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  author: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  coverImage: { 
    type: String, 
    default: '' 
  },
  genre: [{ 
    type: String, 
    required: true 
  }],
  pages: { 
    type: Number, 
    required: true 
  },
  publishedYear: { 
    type: Number, 
    required: true 
  },
  isbn: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  averageRating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  addedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);