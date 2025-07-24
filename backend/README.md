# Notes API Backend - Node.js + Express + MongoDB

A clean and scalable Notes API built with Node.js, Express, and MongoDB using MVC architecture and ES6 modules.

## Features

- ✅ Clean MVC Architecture
- ✅ ES6 Import/Export Modules
- ✅ Centralized Error Handling
- ✅ Async Handler for Controllers
- ✅ Standardized API Responses
- ✅ MongoDB Integration with Mongoose
- ✅ Environment Configuration
- ✅ CORS Support

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── noteController.js    # Note request handlers
├── middleware/
│   └── errorHandler.js      # Global error handling
├── models/
│   └── Note.js              # Note schema/model
├── routes/
│   ├── index.js             # Main routes
│   └── noteRoutes.js        # Note-specific routes
├── services/
│   └── noteService.js       # Business logic layer
├── utils/
│   ├── ApiError.js          # Custom error class
│   ├── ApiResponse.js       # Standardized responses
│   └── asyncHandler.js      # Async error wrapper
├── app.js                   # Express app configuration
├── server.js                # Server entry point
├── package.json             # Dependencies & scripts
└── .env.example             # Environment template
```

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update MongoDB connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/notes-api
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000/api/v1`

### Health Check
- **GET** `/health` - Check API status

### Notes
- **POST** `/notes` - Create a new note
- **GET** `/notes/:id` - Get a note by ID
- **PUT** `/notes/:id` - Update a note by ID

## API Usage Examples

### Create Note
```bash
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my first note."
  }'
```

### Get Note
```bash
curl http://localhost:3000/api/v1/notes/{note_id}
```

### Update Note
```bash
curl -X PUT http://localhost:3000/api/v1/notes/{note_id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note Title",
    "content": "Updated content."
  }'
```

## Response Format

### Success Response
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "title": "Note Title",
    "content": "Note content",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Note retrieved successfully",
  "success": true
}
```

### Error Response
```json
{
  "success": false,
  "message": "Note not found"
}
```

## ES6 Features

This project uses modern ES6 features:
- **Import/Export**: All modules use ES6 import/export syntax
- **Arrow Functions**: Used throughout the codebase
- **Template Literals**: For string interpolation
- **Destructuring**: For cleaner parameter handling
- **Async/Await**: For asynchronous operations

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment configuration
- **cors**: Cross-origin resource sharing
- **nodemon**: Development auto-restart (dev dependency)
