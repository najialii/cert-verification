import sqlite3 from 'sqlite3';
const db = new sqlite3.verbose().Database('./backend/certificates.db');

// Test exact match
const testCertNum = 'AT0116936';

console.log(`Testing EXACT match for certificate: ${testCertNum}`);
db.all('SELECT * FROM certificates WHERE certienum = ? LIMIT 10', [testCertNum], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`Found ${rows.length} results with EXACT match`);
    rows.forEach(row => {
      console.log(`ID: ${row._id}, Cert: ${row.certienum}, Name: ${row.name}`);
    });
  }
  
  // Test LIKE match to see if there are similar ones
  console.log(`\nTesting LIKE match for certificate: ${testCertNum}`);
  db.all('SELECT * FROM certificates WHERE certienum LIKE ? LIMIT 10', [`%${testCertNum}%`], (err2, rows2) => {
    if (err2) {
      console.error('Error:', err2);
    } else {
      console.log(`Found ${rows2.length} results with LIKE match`);
      rows2.forEach(row => {
        console.log(`ID: ${row._id}, Cert: ${row.certienum}, Name: ${row.name}`);
      });
    }
    db.close();
  });
});
