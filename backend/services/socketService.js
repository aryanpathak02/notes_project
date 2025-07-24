/**
 * Socket service for real-time note collaboration
 * Handles WebSocket events related to note operations
 */

/**
 * Emit note update to all connected clients in a note room
 * @param {Object} io - Socket.IO server instance
 * @param {string} noteId - Note ID
 * @param {Object} noteData - Updated note data
 * @param {string} updatedBy - User who made the update
 */
export const broadcastNoteUpdate = (io, noteId, noteData, updatedBy = 'System') => {
    if (!io || !noteId || !noteData) {
        console.warn('Missing required parameters for broadcasting note update');
        return;
    }

    io.to(noteId).emit('note_updated', {
        noteId: noteId,
        data: noteData,
        updatedBy: updatedBy,
        timestamp: new Date().toISOString()
    });

    console.log(`Broadcasted note update for note ${noteId} by ${updatedBy}`);
};

/**
 * Emit note creation to all connected clients
 * @param {Object} io - Socket.IO server instance
 * @param {Object} noteData - Created note data
 * @param {string} createdBy - User who created the note
 */
export const broadcastNoteCreation = (io, noteData, createdBy = 'System') => {
    if (!io || !noteData) {
        console.warn('Missing required parameters for broadcasting note creation');
        return;
    }

    io.emit('note_created', {
        data: noteData,
        createdBy: createdBy,
        timestamp: new Date().toISOString()
    });

    console.log(`Broadcasted note creation: ${noteData._id} by ${createdBy}`);
};

/**
 * Emit note deletion to all connected clients
 * @param {Object} io - Socket.IO server instance
 * @param {string} noteId - Deleted note ID
 * @param {string} deletedBy - User who deleted the note
 */
export const broadcastNoteDeletion = (io, noteId, deletedBy = 'System') => {
    if (!io || !noteId) {
        console.warn('Missing required parameters for broadcasting note deletion');
        return;
    }

    io.emit('note_deleted', {
        noteId: noteId,
        deletedBy: deletedBy,
        timestamp: new Date().toISOString()
    });

    console.log(`Broadcasted note deletion: ${noteId} by ${deletedBy}`);
};

/**
 * Get active users for a specific note room
 * @param {Object} io - Socket.IO server instance
 * @param {string} noteId - Note ID
 * @returns {Array} Array of active users
 */
export const getActiveUsersForNote = async (io, noteId) => {
    if (!io || !noteId) {
        return [];
    }

    try {
        const room = io.sockets.adapter.rooms.get(noteId);
        if (!room) {
            return [];
        }

        const activeUsers = [];
        for (const socketId of room) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket && socket.displayName) {
                activeUsers.push({
                    userId: socketId,
                    displayName: socket.displayName
                });
            }
        }

        return activeUsers;
    } catch (error) {
        console.error('Error getting active users for note:', error);
        return [];
    }
};
