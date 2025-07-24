import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentNoteId = null;
    this.displayName = null;
  }

  /**
   * Connect to Socket.IO server
   */
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentNoteId = null;
    }
  }

  /**
   * Join a note room for collaboration
   * @param {string} noteId - Note ID to join
   * @param {string} displayName - Display name for the session
   */
  joinNoteRoom(noteId, displayName = null) {
    if (!this.socket || !noteId) {
      console.warn('Socket not connected or noteId missing');
      return;
    }

    this.currentNoteId = noteId;
    this.displayName = displayName || `User_${Date.now()}`;

    this.socket.emit('join_note', {
      noteId: noteId,
      displayName: this.displayName
    });

    console.log(`Joining note room: ${noteId} as ${this.displayName}`);
  }

  /**
   * Send note update to other collaborators
   * @param {string} noteId - Note ID
   * @param {string} content - Note content
   * @param {string} title - Note title
   */
  sendNoteUpdate(noteId, content, title = null) {
    if (!this.socket || !noteId) {
      console.warn('Socket not connected or noteId missing');
      return;
    }

    this.socket.emit('note_update', {
      noteId: noteId,
      content: content,
      title: title,
      updatedBy: this.displayName,
      senderId: this.socket.id
    });
  }

  /**
   * Listen for note updates from other collaborators
   * @param {Function} callback - Callback function to handle updates
   */
  onNoteUpdate(callback) {
    if (!this.socket) return;

    this.socket.on('note_updated', callback);
  }

  /**
   * Listen for room join confirmations
   * @param {Function} callback - Callback function to handle room join
   */
  onRoomJoined(callback) {
    if (!this.socket) return;

    this.socket.on('room_joined', callback);
  }

  /**
   * Listen for user join events
   * @param {Function} callback - Callback function to handle user joins
   */
  onUserJoined(callback) {
    if (!this.socket) return;

    this.socket.on('user_joined', callback);
  }

  /**
   * Listen for user leave events
   * @param {Function} callback - Callback function to handle user leaves
   */
  onUserLeft(callback) {
    if (!this.socket) return;

    this.socket.on('user_left', callback);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Get connection status
   */
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Get the current socket ID
   */
  getSocketId() {
    return this.socket?.id;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
