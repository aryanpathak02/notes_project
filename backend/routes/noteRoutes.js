import express from 'express';
import { createNote, getAllNotes, getNoteById, updateNote } from '../controllers/noteController.js';

const router = express.Router();

// POST /notes - Create a new note
router.post('/', createNote);

// GET /notes - Get all notes
router.get('/', getAllNotes);

// GET /notes/:id - Get a note by ID
router.get('/:id', getNoteById);

// PUT /notes/:id - Update a note by ID
router.put('/:id', updateNote);

export default router;
