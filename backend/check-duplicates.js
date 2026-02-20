const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./certificates.db');

console.log('Checking for duplicate certificate numbers...\n');

db.all(`
  SELECT certienum, COUNT(*) as count, GROUP_CONCAT(name) as names
  FROM certificates 
  WHERE certienum IN ('AT0188783', 'AT0188700')
  GROUP BY certienum
`, (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    rows.forEach(row => {
      console.log(`Certificate: ${row.certienum}`);
      console.log(`  Count: ${row.count}`);
      console.log(`  Names: ${row.names}`);
      console.log('');
    });
  }
  
  // Get details of duplicates
  console.log('Details of AT0188783:');
  db.all('SELECT * FROM certificates WHERE certienum = "AT0188783"', (err2, rows2) => {
    if (err2) {
      console.error('Error:', err2);
    } else {
      rows2.forEach(row => {
        console.log(`  ID: ${row._id}, Name: ${row.name}, Course: ${row.coursename}, Expiry: ${row.expairydate}`);
      });
    }
    db.close();
  });
});
