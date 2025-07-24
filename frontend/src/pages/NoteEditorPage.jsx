import React, { useState, useEffect, useRef, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams, useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchNote();
      initializeSocket();
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!note || saving) return;

    try {
      setSaving(true);
      const updateData = {};

      if (title !== note.title) updateData.title = title;
      if (content !== note.content) updateData.content = content;

      if (Object.keys(updateData).length === 0) {
        setSaving(false);
        return;
      }

      await notesAPI.updateNote(id, updateData);

      const updatedNote = { ...note, ...updateData, updatedAt: new Date().toISOString() };
      setNote(updatedNote);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      toast.success('Note saved!');

      if (socketService.isSocketConnected()) {
        socketService.sendNoteUpdate(id, content, title);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  }, [id, note, title, content, saving]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        handleSave();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, handleSave]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNoteById(id);
      const noteData = response.data;
      setNote(noteData);
      setTitle(noteData.title || '');
      setContent(noteData.content || '');
      setLastSaved(new Date(noteData.updatedAt));
    } catch (error) {
      console.error('Error fetching note:', error);
      toast.error('Failed to load note');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = () => {
    socketService.connect();
    socketService.joinNoteRoom(id, `User_${Date.now()}`);

    socketService.onNoteUpdate((data) => {
      if (data.noteId === id && data.senderId !== socketService.getSocketId()) {
        const noteData = data.data || data;
        setContent(noteData.content || '');
        if (typeof noteData.title !== 'undefined') setTitle(noteData.title);
        toast.success(`Note updated by ${data.updatedBy}`);
      }
    });

    socketService.onRoomJoined((data) => {
      setActiveUsers(data.activeUsers || []);
    });

    socketService.onUserJoined((data) => {
      setActiveUsers(data.activeUsers || []);
      toast.success(`${data.displayName} joined the note`);
    });

    socketService.onUserLeft((data) => {
      setActiveUsers(data.activeUsers || []);
      toast(`${data.displayName} left the note`);
    });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = now - lastSaved;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    return lastSaved.toLocaleTimeString();
  };

  const getWordCount = () => {
    if (!content || typeof content !== 'string') return 0;
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
          <p className="text-gray-600 mb-4">The note you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white" onKeyDown={handleKeyDown}>
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none flex-1 mr-4"
            maxLength={100}
          />

          <div className="flex items-center space-x-4">
            {activeUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user) => (
                    <div
                      key={user.userId}
                      className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      title={user.displayName}
                    >
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {activeUsers.length} collaborator{activeUsers.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {saving ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Saving...</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Unsaved changes</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Saved {formatLastSaved()}</span>
                </>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{getWordCount()} words</span>
            <span>{content.length} characters</span>
          </div>
          <div className="text-xs">
            Press Ctrl+S to save manually
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TextareaAutosize
          ref={contentRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your note..."
          className="editor-textarea font-mono text-base leading-7"
          style={{ fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace' }}
          minRows={15}
        />
      </div>
    </div>
  );
};

export default NoteEditorPage;
