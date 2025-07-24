import mongoose from 'mongoose';

/**
 * Note model schema
 * Defines the structure for note documents in MongoDB
 */
const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters']
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Update the updatedAt field before saving
noteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
