import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/database.js';
import { initializeSocket } from './config/socket.js';

// Load environment variables
dotenv.config();

/**
 * Server entry point
 * Starts the Express server with Socket.IO and connects to MongoDB
 */

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io accessible to routes if needed
app.set('io', io);

// Connect to MongoDB
connectDB()
    .then(() => {
        // Start the server only after successful DB connection
        server.listen(PORT, () => {
            console.log(`⚡️ Server is running on port ${PORT}`);
            console.log(`🔌 WebSocket server ready for real-time collaboration`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
