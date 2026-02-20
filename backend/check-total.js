const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./certificates.db');

db.get('SELECT COUNT(*) as total FROM certificates', (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`Total certificates in database: ${result.total}`);
  }
  
  db.get('SELECT COUNT(DISTINCT certienum) as unique_certs FROM certificates WHERE certienum != "" AND certienum IS NOT NULL', (err2, result2) => {
    if (err2) {
      console.error('Error:', err2);
    } else {
      console.log(`Unique certificate numbers: ${result2.unique_certs}`);
    }
    db.close();
  });
});
