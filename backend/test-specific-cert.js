const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./certificates.db');

const searchCert = 'AT0116960';

console.log(`Searching for certificate: ${searchCert}\n`);

// Test exact match in database
db.all('SELECT * FROM certificates WHERE certienum = ?', [searchCert], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`Database results for "${searchCert}":`);
    console.log(`Found ${rows.length} results\n`);
    
    rows.forEach((row, index) => {
      console.log(`Result ${index + 1}:`);
      console.log(`  ID: ${row._id}`);
      console.log(`  Certificate: ${row.certienum}`);
      console.log(`  Name: ${row.name}`);
      console.log(`  Course: ${row.coursename}`);
      console.log(`  Expiry: ${row.expairydate}`);
      console.log('');
    });
  }
  
  // Also check if AT0197327 exists
  console.log('Checking for AT0197327:');
  db.all('SELECT * FROM certificates WHERE certienum = ?', ['AT0197327'], (err2, rows2) => {
    if (err2) {
      console.error('Error:', err2);
    } else {
      console.log(`Found ${rows2.length} results for AT0197327\n`);
      rows2.forEach((row, index) => {
        console.log(`Result ${index + 1}:`);
        console.log(`  ID: ${row._id}`);
        console.log(`  Certificate: ${row.certienum}`);
        console.log(`  Name: ${row.name}`);
        console.log(`  Course: ${row.coursename}`);
        console.log('');
      });
    }
    db.close();
  });
});
