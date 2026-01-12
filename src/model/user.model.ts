import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firstName?: string;
    lastName?: string;
    name: string;
    email: string;
    password?: string;
    image?: string;
    provider?: string;
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 6
    },
    image: {
        type: String
    },
    provider: {
        type: String,
        enum: ['credentials', 'google', 'facebook', 'github']
    }
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);