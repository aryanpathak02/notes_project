# WebSocket Integration Guide - Socket.IO

This document explains the WebSocket integration for real-time note collaboration using Socket.IO.

## 🚀 Features Implemented

- ✅ **Real-time Note Updates**: Instant synchronization of note changes
- ✅ **Room-based Collaboration**: Users join specific note rooms
- ✅ **Active Users Tracking**: See who's currently editing a note
- ✅ **Cursor Position Sharing**: Optional real-time cursor tracking
- ✅ **Automatic Cleanup**: Users are removed when they disconnect

## 📡 WebSocket Events

### Client → Server Events

#### 1. `join_note`
Join a specific note room for collaboration.

**Data:**
```javascript
{
  noteId: "65a1b2c3d4e5f6789012345",  // Required: MongoDB ObjectId
  userName: "John Doe"                // Optional: User display name
}
```

**Response Events:**
- `room_joined` - Confirmation with active users list
- `user_joined` - Broadcast to other users in the room

#### 2. `note_update`
Broadcast note content changes to other users.

**Data:**
```javascript
{
  noteId: "65a1b2c3d4e5f6789012345",  // Required: Note ID
  content: "Updated note content",     // Required: New content
  title: "Updated Title",             // Optional: New title
  updatedBy: "John Doe"               // Optional: User who made the update
}
```

**Response Events:**
- `note_updated` - Broadcast to other users in the room

#### 3. `cursor_position` (Optional)
Share cursor position with other collaborators.

**Data:**
```javascript
{
  noteId: "65a1b2c3d4e5f6789012345",  // Required: Note ID
  position: 150,                      // Cursor position in text
  selection: { start: 100, end: 150 } // Optional: Text selection
}
```

**Response Events:**
- `cursor_updated` - Broadcast to other users in the room

### Server → Client Events

#### 1. `room_joined`
Sent when user successfully joins a note room.

**Data:**
```javascript
{
  noteId: "65a1b2c3d4e5f6789012345",
  activeUsers: [
    {
      userId: "socket_id_123",
      userName: "John Doe",
      joinedAt: "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### 2. `user_joined`
Broadcast when a new user joins the room.

**Data:**
```javascript
{
  userId: "socket_id_456",
  userName: "Jane Smith",
  activeUsers: [...] // Updated active users list
}
```

#### 3. `user_left`
Broadcast when a user leaves the room.

**Data:**
```javascript
{
  userId: "socket_id_456",
  userName: "Jane Smith",
  activeUsers: [...] // Updated active users list
}
```

#### 4. `note_updated`
Broadcast when note content is updated.

**Data:**
```javascript
{
  noteId: "65a1b2c3d4e5f6789012345",
  data: {
    _id: "65a1b2c3d4e5f6789012345",
    title: "Updated Title",
    content: "Updated content",
    updatedAt: "2024-01-01T12:30:00.000Z"
  },
  updatedBy: "John Doe",
  timestamp: "2024-01-01T12:30:00.000Z"
}
```

#### 5. `note_created`
Broadcast when a new note is created.

**Data:**
```javascript
{
  data: {
    _id: "65a1b2c3d4e5f6789012345",
    title: "New Note",
    content: "Note content",
    createdAt: "2024-01-01T12:00:00.000Z"
  },
  createdBy: "John Doe",
  timestamp: "2024-01-01T12:00:00.000Z"
}
```

#### 6. `cursor_updated`
Broadcast cursor position updates.

**Data:**
```javascript
{
  userId: "socket_id_123",
  userName: "John Doe",
  position: 150,
  selection: { start: 100, end: 150 }
}
```

#### 7. `error`
Sent when an error occurs.

**Data:**
```javascript
{
  message: "Error description"
}
```

## 🔧 Frontend Integration Example

### Basic Socket.IO Client Setup

```javascript
import { io } from 'socket.io-client';

// Connect to the WebSocket server
const socket = io('http://localhost:3000');

// Join a note room
socket.emit('join_note', {
  noteId: 'your-note-id',
  userName: 'Your Name'
});

// Listen for note updates
socket.on('note_updated', (data) => {
  console.log('Note updated:', data);
  // Update your UI with the new content
  updateNoteContent(data.data.content, data.data.title);
});

// Listen for active users
socket.on('room_joined', (data) => {
  console.log('Joined room:', data);
  displayActiveUsers(data.activeUsers);
});

socket.on('user_joined', (data) => {
  console.log('User joined:', data);
  displayActiveUsers(data.activeUsers);
});

socket.on('user_left', (data) => {
  console.log('User left:', data);
  displayActiveUsers(data.activeUsers);
});

// Send note updates
function sendNoteUpdate(noteId, content, title) {
  socket.emit('note_update', {
    noteId: noteId,
    content: content,
    title: title,
    updatedBy: 'Your Name'
  });
}

// Handle errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

### React Hook Example

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useNoteCollaboration = (noteId, userName) => {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [noteUpdates, setNoteUpdates] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Join note room
    newSocket.emit('join_note', { noteId, userName });

    // Listen for events
    newSocket.on('room_joined', (data) => {
      setActiveUsers(data.activeUsers);
    });

    newSocket.on('user_joined', (data) => {
      setActiveUsers(data.activeUsers);
    });

    newSocket.on('user_left', (data) => {
      setActiveUsers(data.activeUsers);
    });

    newSocket.on('note_updated', (data) => {
      setNoteUpdates(data);
    });

    return () => newSocket.close();
  }, [noteId, userName]);

  const sendUpdate = (content, title) => {
    if (socket) {
      socket.emit('note_update', {
        noteId,
        content,
        title,
        updatedBy: userName
      });
    }
  };

  return { activeUsers, noteUpdates, sendUpdate };
};
```

## 🔒 Security Considerations

1. **CORS Configuration**: Properly configured for frontend domain
2. **Input Validation**: All socket events validate required parameters
3. **Room Isolation**: Users can only affect notes they've joined
4. **Error Handling**: Graceful error handling for invalid requests

## 🚀 Getting Started

1. **Install Dependencies**: `npm install socket.io`
2. **Start Server**: The WebSocket server starts automatically with the Express server
3. **Connect Frontend**: Use Socket.IO client to connect to `http://localhost:3000`
4. **Join Room**: Emit `join_note` event with a valid note ID
5. **Start Collaborating**: Send and receive real-time updates!

## 📊 Monitoring

The server logs all WebSocket activities:
- User connections/disconnections
- Room joins/leaves
- Note updates
- Errors

Check your server console for real-time collaboration activity.

## 🔧 Configuration

Environment variables for WebSocket configuration:

```env
# Frontend URL for CORS (optional)
FRONTEND_URL=http://localhost:3000

# Server port
PORT=3000
```

## 🎯 Next Steps

- [ ] Add authentication to WebSocket connections
- [ ] Implement operational transformation for conflict resolution
- [ ] Add typing indicators
- [ ] Implement note versioning with WebSocket sync
- [ ] Add file upload collaboration
- [ ] Implement voice/video chat integration
