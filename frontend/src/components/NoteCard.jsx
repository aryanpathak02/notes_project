import React from 'react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Link to={`/note/${note._id}`} className="block">
      <div className="note-card group">
        {/* Note Title */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {note.title || 'Untitled Note'}
          </h3>
        </div>

        {/* Note Content Preview */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {note.content ? truncateContent(note.content) : 'No content yet...'}
          </p>
        </div>

        {/* Note Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated {formatDate(note.updatedAt)}</span>
          </div>
          
          {/* Word count */}
          <div className="flex items-center space-x-1">
            <span>{note.content ? note.content.split(' ').length : 0} words</span>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
