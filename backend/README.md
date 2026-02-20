# Certificate Verification Backend

Node.js + Express + SQLite backend for certificate management.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/content/items/certificates` - Get all certificates
- `POST /api/content/item/certificates` - Create certificate
- `POST /api/collections/save/certificates` - Update certificate
- `DELETE /api/content/item/certificates/:id` - Delete certificate
- `GET /health` - Health check

## Database

Uses SQLite database stored in `certificates.db`

## Update Frontend

Change API URLs in your React app from:
`http://5.189.163.66/cert-verification/api/...`

To:
`http://localhost:3001/api/...`
