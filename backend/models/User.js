import mongoose from 'mongoose';

/**
 * Simple User model for basic identification
 * Can be extended later for full authentication
 */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [20, 'Username cannot exceed 20 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        displayName: {
            type: String,
            required: [true, 'Display name is required'],
            trim: true,
            maxlength: [50, 'Display name cannot exceed 50 characters']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;
