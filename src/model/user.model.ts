import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'user' | 'admin';
  isActive: boolean;
  shelves?: {
    wantToRead: mongoose.Types.ObjectId[];
    currentlyReading: mongoose.Types.ObjectId[];
    read: mongoose.Types.ObjectId[];
  };
  readingProgress?: {
    [bookId: string]: {
      pagesRead: number;
      totalPages: number;
      percentage: number;
      lastUpdated: Date;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { type: String, minlength: 6 },
  image: { type: String },
  provider: { 
    type: String, 
    enum: ['credentials', 'google', 'facebook', 'github'],
    default: 'credentials'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  shelves: {
    wantToRead: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    currentlyReading: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    read: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
  },
  readingProgress: {
    type: Map,
    of: {
      pagesRead: Number,
      totalPages: Number,
      percentage: Number,
      lastUpdated: Date
    }
  }
}, {
  timestamps: true
});


export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);