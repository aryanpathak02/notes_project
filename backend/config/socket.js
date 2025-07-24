import { Server } from 'socket.io';

/**
 * Socket.IO configuration and event handlers
 * Handles real-time collaboration for notes
 */

// Store active users per note room
const activeUsers = new Map();

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO server instance
 */
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        /**
         * Join note room for collaboration
         * Event: join_note
         * Data: { noteId, displayName? }
         * Note: displayName is session-only, not stored in database
         */
        socket.on('join_note', (data) => {
            const { noteId, displayName } = data;
            
            if (!noteId) {
                socket.emit('error', { message: 'Note ID is required to join room' });
                return;
            }

            // Generate session display name (not stored in DB)
            const sessionDisplayName = displayName && displayName.trim() 
                ? displayName.trim().slice(0, 20) // Limit to 20 chars
                : `Anonymous_${socket.id.slice(0, 6)}`;

            // Leave any previous rooms
            socket.rooms.forEach(room => {
                if (room !== socket.id) {
                    socket.leave(room);
                    removeUserFromRoom(room, socket.id);
                }
            });

            // Join the note room
            socket.join(noteId);
            socket.noteId = noteId;
            socket.displayName = sessionDisplayName;

            // Add user to active users for this note
            addUserToRoom(noteId, socket.id, sessionDisplayName);

            // Notify others in the room
            socket.to(noteId).emit('user_joined', {
                userId: socket.id,
                displayName: sessionDisplayName,
                activeUsers: getActiveUsersForRoom(noteId)
            });

            // Send current active users to the joining user
            socket.emit('room_joined', {
                noteId: noteId,
                activeUsers: getActiveUsersForRoom(noteId)
            });

            console.log(`User ${sessionDisplayName} (${socket.id}) joined note room: ${noteId}`);
        });

        /**
         * Broadcast note content changes
         * Event: note_update
         * Data: { noteId, content, title?, updatedBy }
         */
        socket.on('note_update', (data) => {
            const { noteId, content, title, updatedBy = socket.displayName, senderId } = data;
            
            if (!noteId || content === undefined) {
                socket.emit('error', { message: 'Note ID and content are required' });
                return;
            }

            // Broadcast the update to all users in the room except sender
            socket.to(noteId).emit('note_updated', {
                noteId: noteId,
                content: content,
                title: title,
                updatedBy: updatedBy,
                timestamp: new Date().toISOString(),
                senderId: senderId // Pass the original sender's socket ID
            });

            console.log(`Note ${noteId} updated by ${updatedBy} (${senderId})`);
        });

        /**
         * Handle cursor position sharing (optional)
         * Event: cursor_position
         * Data: { noteId, position, selection }
         */
        socket.on('cursor_position', (data) => {
            const { noteId, position, selection } = data;
            
            if (!noteId) return;

            socket.to(noteId).emit('cursor_updated', {
                userId: socket.id,
                displayName: socket.displayName,
                position: position,
                selection: selection
            });
        });

        /**
         * Handle user disconnect
         */
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            
            if (socket.noteId) {
                // Remove user from active users
                removeUserFromRoom(socket.noteId, socket.id);
                
                // Notify others in the room
                socket.to(socket.noteId).emit('user_left', {
                    userId: socket.id,
                    displayName: socket.displayName,
                    activeUsers: getActiveUsersForRoom(socket.noteId)
                });
            }
        });

        /**
         * Handle errors
         */
        socket.on('error', (error) => {
            console.error('Socket error:', error);
            socket.emit('error', { message: 'An error occurred' });
        });
    });

    return io;
};

/**
 * Helper functions for managing active users
 */

function addUserToRoom(noteId, socketId, displayName) {
    if (!activeUsers.has(noteId)) {
        activeUsers.set(noteId, new Map());
    }
    activeUsers.get(noteId).set(socketId, { displayName, joinedAt: new Date() });
}

function removeUserFromRoom(noteId, socketId) {
    if (activeUsers.has(noteId)) {
        activeUsers.get(noteId).delete(socketId);
        
        // Clean up empty rooms
        if (activeUsers.get(noteId).size === 0) {
            activeUsers.delete(noteId);
        }
    }
}

function getActiveUsersForRoom(noteId) {
    if (!activeUsers.has(noteId)) {
        return [];
    }
    
    return Array.from(activeUsers.get(noteId).entries()).map(([socketId, userData]) => ({
        userId: socketId,
        displayName: userData.displayName,
        joinedAt: userData.joinedAt
    }));
}

export default initializeSocket;
