const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./certificates.db');

console.log('Finding and removing duplicate certificates...\n');

// Step 1: Find all duplicate certificate numbers
db.all(`
  SELECT certienum, COUNT(*) as count
  FROM certificates 
  WHERE certienum != '' AND certienum IS NOT NULL
  GROUP BY certienum 
  HAVING count > 1
  ORDER BY count DESC
`, (err, duplicates) => {
  if (err) {
    console.error('Error finding duplicates:', err);
    db.close();
    return;
  }
  
  console.log(`Found ${duplicates.length} certificate numbers with duplicates\n`);
  
  if (duplicates.length === 0) {
    console.log('No duplicates to remove!');
    db.close();
    return;
  }
  
  let processed = 0;
  let deleted = 0;
  
  // Process each duplicate
  duplicates.forEach((dup, index) => {
    const certNum = dup.certienum;
    
    // Get all records for this certificate number
    db.all('SELECT * FROM certificates WHERE certienum = ? ORDER BY _created DESC', [certNum], (err2, records) => {
      if (err2) {
        console.error(`Error getting records for ${certNum}:`, err2);
        processed++;
        return;
      }
      
      // Find the best record (one with proper name that's different from course name)
      let keepRecord = records[0]; // Default to most recent
      
      for (const record of records) {
        // Prefer records where name is not empty and different from coursename
        if (record.name && record.name.trim() !== '' && 
            record.name !== record.coursename) {
          keepRecord = record;
          break;
        }
      }
      
      // Delete all other records
      const idsToDelete = records
        .filter(r => r._id !== keepRecord._id)
        .map(r => r._id);
      
      if (idsToDelete.length > 0) {
        console.log(`Certificate: ${certNum} (${dup.count} duplicates)`);
        console.log(`  Keeping: ${keepRecord.name} (ID: ${keepRecord._id})`);
        console.log(`  Deleting ${idsToDelete.length} duplicate(s)`);
        
        idsToDelete.forEach(id => {
          const recordToDelete = records.find(r => r._id === id);
          console.log(`    - ${recordToDelete.name} (ID: ${id})`);
        });
        console.log('');
        
        // Delete the duplicates
        const placeholders = idsToDelete.map(() => '?').join(',');
        db.run(`DELETE FROM certificates WHERE _id IN (${placeholders})`, idsToDelete, (err3) => {
          if (err3) {
            console.error(`Error deleting duplicates for ${certNum}:`, err3);
          } else {
            deleted += idsToDelete.length;
          }
          
          processed++;
          
          // Check if we're done
          if (processed === duplicates.length) {
            console.log(`\n✅ Complete! Deleted ${deleted} duplicate certificates.`);
            
            // Verify
            db.get('SELECT COUNT(*) as total FROM certificates', (err4, result) => {
              if (!err4) {
                console.log(`Total certificates remaining: ${result.total}`);
              }
              db.close();
            });
          }
        });
      } else {
        processed++;
        if (processed === duplicates.length) {
          console.log(`\n✅ Complete! Deleted ${deleted} duplicate certificates.`);
          db.close();
        }
      }
    });
  });
});
