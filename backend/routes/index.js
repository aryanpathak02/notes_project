import express from 'express';
import noteRoutes from './noteRoutes.js';

const router = express.Router();

/**
 * Main routes index
 * Combines all route modules
 */

// Mount note routes
router.use('/notes', noteRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running successfully',
        timestamp: new Date().toISOString()
    });
});

export default router;
