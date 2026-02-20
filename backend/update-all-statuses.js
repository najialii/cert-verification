const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Update all certificate statuses based on current date
async function updateAllStatuses() {
  console.log('=== UPDATING ALL CERTIFICATE STATUSES ===\n');

  // Get current date
  const today = new Date();
  today.setHours(0, 0, 0,