const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./certificates.db');

console.log('Testing search for "Jakeer":');
db.all('SELECT certienum, name, coursename FROM certificates WHERE name LIKE "%Jakeer%" LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Found:', rows.length, 'results');
    rows.forEach(row => {
      console.log(`${row.certienum} - ${row.name} - ${row.coursename}`);
    });
  }
  
  console.log('\nTesting search for "AT0116936":');
  db.all('SELECT certienum, name, coursename FROM certificates WHERE certienum LIKE "%AT0116936%" LIMIT 5', (err2, rows2) => {
    if (err2) {
      console.error('Error:', err2);
    } else {
      console.log('Found:', rows2.length, 'results');
      rows2.forEach(row => {
        console.log(`${row.certienum} - ${row.name} - ${row.coursename}`);
      });
    }
    
    console.log('\nTotal certificates in database:');
    db.get('SELECT COUNT(*) as count FROM certificates', (err3, row) => {
      if (err3) {
        console.error('Error:', err3);
      } else {
        console.log('Total:', row.count);
      }
      db.close();
    });
  });
});
