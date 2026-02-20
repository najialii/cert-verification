const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// List of course names that shouldn't be in the name field
const courseNames = [
  'Fire Warden', 'Fire Marshal', 'Fire Watch', 'Basic Fire Fighting',
  'Flagman', 'Standby Man', 'Manlift Operator', 'Forklift Operator',
  'HAZCOM', 'Hydrogen Sulfide', 'H2S', 'SCBA', 'Defensive Driving',
  'Electrical Safety', 'Working at Height', 'Confined Space',
  'Overhead Crane', 'Scaffolding', 'Quality Awareness',
  'Emergency Response', 'Risk Assessment', 'Job Safety Analysis'
];

// Delete corrupted records where name is actually a course name
function deleteCorruptedRecords() {
  return new Promise((resolve, reject) => {
    const coursePattern = courseNames.join('|');
    const query = `
      DELETE FROM certificates 
      WHERE name REGEXP '(${coursePattern})'
      AND name = coursename
    `;
    
    // Since SQLite doesn't support REGEXP by default, we'll do it differently
    let deletePromises = courseNames.map(courseName => {
      return new Promise((resolveDelete, rejectDelete) => {
        db.run(`
          DELETE FROM certificates 
          WHERE name = ? AND coursename = ?
        `, [courseName, courseName], function(err) {
          if (err) {
            rejectDelete(err);
          } else {
            if (this.changes > 0) {
              console.log(`   Deleted ${this.changes} corrupted records with name="${courseName}"`);
            }
            resolveDelete(this.changes);
          }
        });
      });
    });

    Promise.all(deletePromises)
      .then(results => {
        const totalDeleted = results.reduce((sum, count) => sum + count, 0);
        resolve(totalDeleted);
      })
      .catch(reject);
  });
}

// Find records where name contains course-like terms
function findCorruptedRecords() {
  return new Promise((resolve, reject) => {
    let findPromises = courseNames.map(courseName => {
      return new Promise((resolveFind, rejectFind) => {
        db.all(`
          SELECT _id, certienum, name, coursename 
          FROM certificates 
          WHERE name LIKE '%${courseName}%'
          LIMIT 5
        `, (err, rows) => {
          if (err) {
            rejectFind(err);
          } else {
            resolveFind(rows);
          }
        });
      });
    });

    Promise.all(findPromises)
      .then(results => {
        const allCorrupted = results.flat();
        resolve(allCorrupted);
      })
      .catch(reject);
  });
}

// Clean up the database by removing obviously corrupted records
async function comprehensiveCleanup() {
  try {
    console.log('=== COMPREHENSIVE DATA CLEANUP ===\n');

    // Get initial count
    const initialCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM certificates', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    console.log(`Initial record count: ${initialCount}`);

    // Find corrupted records
    console.log('\n1. Finding corrupted records...');
    const corrupted = await findCorruptedRecords();
    if (corrupted.length > 0) {
      console.log(`   Found ${corrupted.length} potentially corrupted records:`);
      corrupted.slice(0, 10).forEach(record => {
        console.log(`   ${record.certienum}: Name="${record.name}", Course="${record.coursename}"`);
      });
      if (corrupted.length > 10) {
        console.log(`   ... and ${corrupted.length - 10} more`);
      }
    }

    // Delete corrupted records
    console.log('\n2. Deleting corrupted records...');
    const deletedCount = await deleteCorruptedRecords();
    console.log(`   Deleted ${deletedCount} corrupted records`);

    // Remove any remaining duplicates
    console.log('\n3. Removing remaining duplicates...');
    const duplicatesRemoved = await new Promise((resolve, reject) => {
      db.run(`
        DELETE FROM certificates 
        WHERE _id NOT IN (
          SELECT _id FROM (
            SELECT _id, certienum, MAX(_created) as latest
            FROM certificates 
            GROUP BY certienum
          ) as latest_certs
        )
      `, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
    console.log(`   Removed ${duplicatesRemoved} duplicate records`);

    // Get final count
    const finalCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM certificates', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    console.log('\n=== CLEANUP SUMMARY ===');
    console.log(`Initial records: ${initialCount}`);
    console.log(`Corrupted deleted: ${deletedCount}`);
    console.log(`Duplicates removed: ${duplicatesRemoved}`);
    console.log(`Final records: ${finalCount}`);
    console.log(`Total cleaned: ${initialCount - finalCount}`);

    // Check AT0160137 again
    console.log('\n=== CHECKING AT0160137 ===');
    db.all('SELECT * FROM certificates WHERE certienum = ?', ['AT0160137'], (err, rows) => {
      if (err) {
        console.error('Error checking AT0160137:', err);
      } else if (rows.length > 0) {
        rows.forEach(cert => {
          console.log(`Name: ${cert.name}`);
          console.log(`Course: ${cert.coursename}`);
          console.log(`Expiry: ${cert.expairydate}`);
          console.log(`Status: ${cert.status ? 'Valid' : 'Expired'}`);
        });
      } else {
        console.log('Certificate AT0160137 not found (may have been deleted as corrupted)');
      }
      
      db.close();
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    db.close();
  }
}

// Run the comprehensive cleanup
comprehensiveCleanup();