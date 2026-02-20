const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Check specific certificate
function checkSpecificCert(certNum) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM certificates WHERE certienum = ?', [certNum], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Find and fix data structure issues
function findDataIssues() {
  return new Promise((resolve, reject) => {
    // Find records where name and course might be swapped
    db.all(`
      SELECT _id, certienum, name, coursename, expairydate 
      FROM certificates 
      WHERE name LIKE '%Fire%' OR name LIKE '%Safety%' OR name LIKE '%Training%'
      OR coursename LIKE '%Mohammed%' OR coursename LIKE '%Ahmad%' OR coursename LIKE '%Ali%'
      LIMIT 20
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Find duplicates
function findDuplicates() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT certienum, COUNT(*) as count 
      FROM certificates 
      GROUP BY certienum 
      HAVING COUNT(*) > 1 
      ORDER BY count DESC 
      LIMIT 20
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Remove duplicates (keep the most recent one)
function removeDuplicates() {
  return new Promise((resolve, reject) => {
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
}

// Fix swapped name/course data
function fixSwappedData() {
  return new Promise((resolve, reject) => {
    // Find records where name looks like a course and course looks like a name
    db.all(`
      SELECT _id, certienum, name, coursename 
      FROM certificates 
      WHERE (name LIKE '%Fire%' OR name LIKE '%Safety%' OR name LIKE '%Training%' OR name LIKE '%HAZCOM%')
      AND (coursename LIKE '%Mohammed%' OR coursename LIKE '%Ahmad%' OR coursename LIKE '%Ali%' OR coursename LIKE '%Khan%')
    `, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (rows.length === 0) {
        resolve(0);
        return;
      }

      console.log(`Found ${rows.length} records with swapped name/course data`);
      
      let fixed = 0;
      let promises = rows.map(row => {
        return new Promise((resolveUpdate, rejectUpdate) => {
          // Swap name and coursename
          db.run(`
            UPDATE certificates 
            SET name = ?, coursename = ?, _modified = ?
            WHERE _id = ?
          `, [row.coursename, row.name, Date.now(), row._id], function(err) {
            if (err) {
              console.error(`Error fixing ${row.certienum}:`, err.message);
              rejectUpdate(err);
            } else {
              console.log(`Fixed ${row.certienum}: "${row.name}" ↔ "${row.coursename}"`);
              fixed++;
              resolveUpdate();
            }
          });
        });
      });

      Promise.all(promises)
        .then(() => resolve(fixed))
        .catch(reject);
    });
  });
}

// Main function
async function fixDataIssues() {
  try {
    console.log('=== CHECKING DATA ISSUES ===\n');

    // Check specific certificate
    console.log('1. Checking certificate AT0160137:');
    const specificCert = await checkSpecificCert('AT0160137');
    if (specificCert.length > 0) {
      specificCert.forEach(cert => {
        console.log(`   ID: ${cert._id}`);
        console.log(`   Name: ${cert.name}`);
        console.log(`   Course: ${cert.coursename}`);
        console.log(`   Expiry: ${cert.expairydate}`);
        console.log('   ---');
      });
    } else {
      console.log('   Certificate AT0160137 not found');
    }

    // Find data structure issues
    console.log('\n2. Checking for swapped name/course data:');
    const issues = await findDataIssues();
    if (issues.length > 0) {
      console.log(`   Found ${issues.length} potential issues:`);
      issues.forEach(issue => {
        console.log(`   ${issue.certienum}: Name="${issue.name}", Course="${issue.coursename}"`);
      });
    } else {
      console.log('   No obvious swapped data found');
    }

    // Find duplicates
    console.log('\n3. Checking for duplicates:');
    const duplicates = await findDuplicates();
    if (duplicates.length > 0) {
      console.log(`   Found ${duplicates.length} certificate numbers with duplicates:`);
      duplicates.forEach(dup => {
        console.log(`   ${dup.certienum}: ${dup.count} copies`);
      });
    } else {
      console.log('   No duplicates found');
    }

    console.log('\n=== FIXING ISSUES ===\n');

    // Fix swapped data
    console.log('1. Fixing swapped name/course data...');
    const swapFixed = await fixSwappedData();
    console.log(`   Fixed ${swapFixed} records with swapped data`);

    // Remove duplicates
    console.log('\n2. Removing duplicate certificates...');
    const duplicatesRemoved = await removeDuplicates();
    console.log(`   Removed ${duplicatesRemoved} duplicate records`);

    // Final stats
    console.log('\n=== FINAL STATISTICS ===');
    db.get('SELECT COUNT(*) as total FROM certificates', (err, row) => {
      if (err) {
        console.error('Error getting final count:', err);
      } else {
        console.log(`Total certificates in database: ${row.total}`);
      }

      // Check the specific certificate again
      checkSpecificCert('AT0160137').then(finalCert => {
        if (finalCert.length > 0) {
          console.log('\nAT0160137 after fixes:');
          finalCert.forEach(cert => {
            console.log(`   Name: ${cert.name}`);
            console.log(`   Course: ${cert.coursename}`);
            console.log(`   Expiry: ${cert.expairydate}`);
          });
        }
        db.close();
      });
    });

  } catch (error) {
    console.error('Error fixing data issues:', error);
    db.close();
  }
}

// Run the fixes
fixDataIssues();