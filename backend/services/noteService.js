import Note from '../models/Note.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a new note
 * @param {Object} noteData - Note data containing title and content
 * @returns {Promise<Object>} Created note
 */
export const createNote = async (noteData) => {
    const { title, content } = noteData;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const note = await Note.create({
        title: title.trim(),
        content: content.trim()
    });

    return note;
};

/**
 * Get all notes
 * @returns {Promise<Array>} Array of all notes
 */
export const getAllNotes = async () => {
    const notes = await Note.find().sort({ updatedAt: -1 });
    return notes;
};

/**
 * Get a note by ID
 * @param {string} noteId - Note ID
 * @returns {Promise<Object>} Found note
 */
export const getNoteById = async (noteId) => {
    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const note = await Note.findById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return note;
};

/**
 * Update a note by ID
 * @param {string} noteId - Note ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated note
 */
export const updateNote = async (noteId, updateData) => {
    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    const { title, content } = updateData;

    if (!title && !content) {
        throw new ApiError(400, "At least title or content must be provided for update");
    }

    const updateFields = {};
    if (title) updateFields.title = title.trim();
    if (content) updateFields.content = content.trim();
    updateFields.updatedAt = Date.now();

    const note = await Note.findByIdAndUpdate(
        noteId,
        updateFields,
        { new: true, runValidators: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return note;
};
