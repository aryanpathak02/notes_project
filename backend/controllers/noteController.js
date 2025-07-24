import { createNote as createNoteService, getAllNotes as getAllNotesService, getNoteById as getNoteByIdService, updateNote as updateNoteService } from '../services/noteService.js';
import { broadcastNoteCreation, broadcastNoteUpdate } from '../services/socketService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Note controller
 * Handles HTTP requests and responses for note operations
 */

/**
 * Create a new note
 * POST /notes
 */
export const createNote = asyncHandler(async (req, res) => {
    const note = await createNoteService(req.body);
    
    // Broadcast note creation to all connected clients
    const io = req.app.get('io');
    if (io) {
        broadcastNoteCreation(io, note, req.body.createdBy || 'Anonymous');
    }
    
    res.status(201).json(
        new ApiResponse(201, note, "Note created successfully")
    );
});

/**
 * Get all notes
 * GET /notes
 */
export const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await getAllNotesService();
    
    res.status(200).json(
        new ApiResponse(200, notes, "Notes retrieved successfully")
    );
});

/**
 * Get a note by ID
 * GET /notes/:id
 */
export const getNoteById = asyncHandler(async (req, res) => {
    const note = await getNoteByIdService(req.params.id);
    
    res.status(200).json(
        new ApiResponse(200, note, "Note retrieved successfully")
    );
});

/**
 * Update a note by ID
 * PUT /notes/:id
 */
export const updateNote = asyncHandler(async (req, res) => {
    const note = await updateNoteService(req.params.id, req.body);
    

    
    res.status(200).json(
        new ApiResponse(200, note, "Note updated successfully")
    );
});
