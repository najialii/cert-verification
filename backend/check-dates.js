const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Check sample records with expiry dates
db.all(`
  SELECT certienum, name, coursename, expairydate, status 
  FROM certificates 
  WHERE expairydate IS NOT NULL 
  LIMIT 10
`, (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('\nSample records with expiry dates:');
    console.log('=====================================');
    rows.forEach(row => {
      console.log(`Cert: ${row.certienum}`);
      console.log(`Name: ${row.name}`);
      console.log(`Course: ${row.coursename}`);
      console.log(`Expiry: ${row.expairydate}`);
      console.log(`Status: ${row.status}`);
      console.log('---');
    });
  }
  
  // Check records with NULL expiry dates
  db.get(`
    SELECT COUNT(*) as count 
    FROM certificates 
    WHERE expairydate IS NULL OR expairydate = ''
  `, (err, row) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(`\nRecords with NULL/empty expiry dates: ${row.count}`);
    }
    
    // Check total records
    db.get(`SELECT COUNT(*) as total FROM certificates`, (err, row) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`Total records: ${row.total}`);
      }
      db.close();
    });
  });
});