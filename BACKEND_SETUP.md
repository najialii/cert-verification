# Backend Setup Complete! ✅

## What Was Done

1. **Created Node.js Backend** (`backend/` folder)
   - Express.js server
   - SQLite database
   - Same API endpoints as Cockpit CMS
   - Runs on `http://localhost:3001`

2. **Updated Frontend**
   - All components now use environment variable for API URL
   - Easy switching between local and remote backend

3. **Backend is Running**
   - Server started on port 3001
   - Database created: `backend/certificates.db`
   - Ready to accept requests

## How to Use

### Current Setup (Local Backend)
The app is now using the local Node.js backend at `http://localhost:3001`

### To Switch Back to Remote Backend
Edit `.env` file:
```
# Comment out local
# VITE_API_URL=http://localhost:3001

# Uncomment remote
VITE_API_URL=http://5.189.163.66/cert-verification
```

Then restart your React app.

## Backend Commands

```bash
# Start backend
cd backend
npm start

# Start with auto-reload (development)
npm run dev

# Stop backend
# Press Ctrl+C in the terminal
```

## API Endpoints (Same as Cockpit CMS)

- `GET /api/content/items/certificates` - List certificates
- `POST /api/content/item/certificates` - Create certificate
- `POST /api/collections/save/certificates` - Update certificate
- `DELETE /api/content/item/certificates/:id` - Delete certificate

## Database

- **Type**: SQLite
- **Location**: `backend/certificates.db`
- **Schema**:
  - `_id` - Unique ID
  - `certienum` - Certificate number
  - `name` - Student name
  - `coursename` - Course name
  - `expairydate` - Expiry date (YYYY-MM-DD)
  - `status` - Valid (1) or Invalid (0)
  - `_created` - Creation timestamp
  - `_modified` - Last modified timestamp
  - `_state` - Active (1) or Deleted (0)

## Features

✅ All CRUD operations working
✅ Bulk upload support
✅ Search functionality
✅ Delete all functionality
✅ Same API structure as Cockpit CMS
✅ No authentication needed (local development)

## Next Steps

1. Test the bulk upload with your CSV files
2. All data will be stored locally in SQLite
3. You can easily backup/restore the `certificates.db` file
4. When ready for production, switch back to remote backend in `.env`
