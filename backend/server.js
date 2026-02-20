const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Create certificates table
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS certificates (
      _id TEXT PRIMARY KEY,
      certienum TEXT,
      name TEXT,
      coursename TEXT,
      expairydate TEXT,
      status INTEGER DEFAULT 1,
      _created INTEGER,
      _modified INTEGER,
      _state INTEGER DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Certificates table ready');
    }
  });
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET all certificates
app.get('/api/content/items/certificates', (req, res) => {
  const { _limit, _start, filter } = req.query;
  
  // Log incoming request for debugging
  console.log('Search request:', {
    url: req.url,
    query: req.query,
    'filter[certienum]': req.query['filter[certienum]'],
    filter: filter
  });
  
  let query = 'SELECT * FROM certificates WHERE _state = 1';
  let params = [];
  
  // Handle filter - search ONLY by certificate number (exact match)
  const certienumFilter = req.query['filter[certienum]'];
  
  if (certienumFilter) {
    // Search by certificate number only (exact match)
    query += ' AND certienum = ?';
    params.push(certienumFilter);
    console.log('Using filter[certienum]:', certienumFilter);
  } else if (filter) {
    // Check if filter is already an object (Express parsed it)
    if (typeof filter === 'object' && filter.certienum) {
      query += ' AND certienum = ?';
      params.push(filter.certienum);
      console.log('Using filter object:', filter.certienum);
    } else if (typeof filter === 'string') {
      // Try to parse as JSON string
      try {
        const filterObj = JSON.parse(filter);
        if (filterObj.certienum) {
          query += ' AND certienum = ?';
          params.push(filterObj.certienum);
          console.log('Using parsed filter:', filterObj.certienum);
        }
      } catch (e) {
        console.error('Filter parse error:', e);
      }
    }
  }
  
  console.log('Final query:', query);
  console.log('Query params:', params);
  
  query += ' ORDER BY _created DESC';
  
  // Handle pagination
  if (_limit) {
    query += ' LIMIT ?';
    params.push(parseInt(_limit));
    
    if (_start) {
      query += ' OFFSET ?';
      params.push(parseInt(_start));
    }
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching certificates:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Convert status to boolean
    const certificates = rows.map(row => ({
      ...row,
      status: row.status === 1
    }));
    
    res.json(certificates);
  });
});

// POST create certificate
app.post('/api/content/item/certificates', (req, res) => {
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }
  
  const id = generateId();
  const now = Date.now();
  
  const query = `
    INSERT INTO certificates (_id, certienum, name, coursename, expairydate, status, _created, _modified, _state)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;
  
  const params = [
    id,
    data.certienum || null,
    data.name || null,
    data.coursename || null,
    data.expairydate || null,
    data.status ? 1 : 0,
    now,
    now
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error creating certificate:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      _id: id,
      ...data,
      _created: now,
      _modified: now
    });
  });
});

// POST update certificate
app.post('/api/collections/save/certificates', (req, res) => {
  const { _id, certienum, name, coursename, expairydate, status, _state } = req.body;
  
  if (!_id) {
    return res.status(400).json({ error: 'No ID provided' });
  }
  
  const now = Date.now();
  
  const query = `
    UPDATE certificates 
    SET certienum = ?, name = ?, coursename = ?, expairydate = ?, status = ?, _modified = ?, _state = ?
    WHERE _id = ?
  `;
  
  const params = [
    certienum || null,
    name || null,
    coursename || null,
    expairydate || null,
    status ? 1 : 0,
    now,
    _state !== undefined ? _state : 1,
    _id
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error updating certificate:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.json({
      _id,
      certienum,
      name,
      coursename,
      expairydate,
      status,
      _modified: now
    });
  });
});

// DELETE certificate
app.delete('/api/content/item/certificates/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM certificates WHERE _id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting certificate:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.json({ success: true, deleted: id });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Certificate API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Certificate API running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${path.join(__dirname, 'certificates.db')}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
