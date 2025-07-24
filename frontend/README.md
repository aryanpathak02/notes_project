# Notes App Frontend - React + Vite + TailwindCSS

A modern, responsive frontend for the collaborative notes application built with React, Vite, and TailwindCSS.

## 🚀 Features

- ✅ **Modern React Setup**: Built with Vite for fast development
- ✅ **TailwindCSS Styling**: Beautiful, responsive design
- ✅ **React Router**: Client-side routing for SPA experience
- ✅ **Axios Integration**: Clean API calls to backend
- ✅ **Socket.IO Ready**: Prepared for real-time collaboration
- ✅ **Auto-save**: Automatic saving every 2 seconds
- ✅ **Full-screen Editor**: Distraction-free writing experience
- ✅ **Real-time Collaboration**: See active users and live updates

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with navigation
│   │   ├── NoteCard.jsx            # Note preview cards
│   │   ├── CreateNoteModal.jsx     # Modal for creating notes
│   │   └── LoadingSpinner.jsx      # Loading component
│   ├── pages/
│   │   ├── HomePage.jsx            # Notes list page (/)
│   │   ├── NoteEditorPage.jsx      # Full-screen editor (/note/:id)
│   │   └── NotFoundPage.jsx        # 404 page
│   ├── services/
│   │   ├── api.js                  # Axios API service
│   │   └── socket.js               # Socket.IO service
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # TailwindCSS styles
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # TailwindCSS configuration
└── .env                           # Environment variables
```

## 🛠 Installation & Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

## 📱 Pages & Routes

### Home Page (`/`)
- **Purpose**: Display all notes in a grid layout
- **Features**: 
  - Create new notes
  - View note previews
  - Search and filter (future)
  - Responsive grid layout

### Note Editor (`/note/:id`)
- **Purpose**: Full-screen note editing experience
- **Features**:
  - Auto-save every 2 seconds
  - Real-time collaboration indicators
  - Active users display
  - Word/character count
  - Manual save with Ctrl+S
  - Monospace font for coding

## 🎨 Design Features

### Modern UI Components
- **Cards**: Clean note preview cards with hover effects
- **Modals**: Smooth modal animations for note creation
- **Buttons**: Consistent button styling with loading states
- **Forms**: Well-designed form inputs with validation

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Grid Layout**: Responsive note grid (1-4 columns)
- **Full-screen Editor**: Distraction-free writing on all devices

### Color Scheme
- **Primary**: Blue tones for actions and highlights
- **Gray Scale**: Clean grays for text and backgrounds
- **Status Colors**: Green (saved), Yellow (unsaved), Red (errors)

## 🔌 API Integration

### Axios Service (`src/services/api.js`)
- **GET /notes**: Fetch all notes
- **GET /notes/:id**: Fetch specific note
- **POST /notes**: Create new note
- **PUT /notes/:id**: Update note
- **GET /health**: Backend health check

### Error Handling
- Automatic error notifications
- Graceful fallbacks for network issues
- User-friendly error messages

## 🚀 Socket.IO Integration

### Real-time Features (Ready for Implementation)
- **Join Note Rooms**: Automatic room joining when editing
- **Live Updates**: See changes from other users instantly
- **Active Users**: Display who's currently editing
- **Cursor Sharing**: Optional cursor position sharing

### Socket Service (`src/services/socket.js`)
```javascript
// Connect to WebSocket
socketService.connect();

// Join note room
socketService.joinNoteRoom(noteId, displayName);

// Send updates
socketService.sendNoteUpdate(noteId, content, title);

// Listen for updates
socketService.onNoteUpdate((data) => {
  // Handle real-time updates
});
```

## ⌨️ Keyboard Shortcuts

- **Ctrl+S**: Manual save
- **Escape**: Close modals
- **Tab**: Navigate between form fields

## 🔄 Auto-save Behavior

1. **Trigger**: Any change to title or content
2. **Delay**: 2 seconds after last keystroke
3. **Indication**: Visual status indicator
4. **Fallback**: Manual save button always available

## 📊 Performance Features

- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Vite's fast bundling
- **Minimal Dependencies**: Only essential packages
- **Responsive Images**: Optimized for all devices

## 🎯 Future Enhancements

- [ ] Rich text editor (WYSIWYG)
- [ ] Note categories and tags
- [ ] Search and filtering
- [ ] Export to PDF/Markdown
- [ ] Dark mode toggle
- [ ] Offline support with PWA
- [ ] Voice notes integration
- [ ] File attachments

## 🚀 Getting Started

1. **Start Backend**: Make sure the backend server is running on port 3000
2. **Install Frontend**: Run `npm install` in the frontend directory
3. **Start Development**: Run `npm run dev`
4. **Open Browser**: Navigate to `http://localhost:3000`
5. **Create Notes**: Click "New Note" to start writing!

The frontend is now fully integrated with your backend APIs and ready for real-time collaboration! 🎉
