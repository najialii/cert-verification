const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database(path.join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if date is valid and not expired
function checkExpiryStatus(expiryDate) {
  if (!expiryDate) return false;
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry >= today;
}

// Parse cleaned CSV
function parseCleanedCSV(csvContent) {
  const rows = csvContent.trim().split("\n");
  if (rows.length === 0) return [];

  const parsedRows = rows
    .filter(row => row.trim() !== "")
    .map(row => {
      const parts = row.split(",");
      
      return {
        name: parts[0] || "",
        certienum: parts[1] || "",
        coursename: parts[2] || "",
        expairydate: parts[3] || ""
      };
    })
    .filter(row => row.certienum.trim() !== ""); // Only include rows with certificate numbers

  return parsedRows;
}

// Insert certificate with duplicate checking
function insertCertificate(cert) {
  return new Promise((resolve, reject) => {
    // First check if certificate already exists
    db.get('SELECT _id FROM certificates WHERE certienum = ?', [cert.certienum], (err, existing) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (existing) {
        // Certificate already exists, skip
        resolve({ skipped: true, reason: 'duplicate' });
        return;
      }
      
      const id = generateId();
      const now = Date.now();
      
      let formattedDate = cert.expairydate || null;
      const status = checkExpiryStatus(formattedDate) ? 1 : 0;
      
      const query = `
        INSERT INTO certificates (_id, certienum, name, coursename, expairydate, status, _created, _modified, _state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `;
      
      const params = [
        id,
        cert.certienum || null,
        cert.name || null,
        cert.coursename || null,
        formattedDate,
        status,
        now,
        now
      ];
      
      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ inserted: true, id: id });
        }
      });
    });
  });
}

// Main import function
async function importCleanedCSVFiles() {
  const csvDir = path.join(__dirname, 'cleaned-csv');
  
  if (!fs.existsSync(csvDir)) {
    console.error('Cleaned CSV directory not found:', csvDir);
    console.log('Please run clean-csv-data.js first to generate cleaned CSV files.');
    process.exit(1);
  }

  const files = fs.readdirSync(csvDir).filter(f => f.startsWith('cleaned_') && f.endsWith('.csv'));
  console.log(`Found ${files.length} cleaned CSV files\n`);

  let totalProcessed = 0;
  let totalImported = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const file of files) {
    console.log(`Processing: ${file}`);
    const filePath = path.join(csvDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const certificates = parseCleanedCSV(content);
    console.log(`  Found ${certificates.length} entries`);

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      
      try {
        const result = await insertCertificate(cert);
        
        if (result.inserted) {
          imported++;
        } else if (result.skipped) {
          skipped++;
        }
        
        if ((imported + skipped + failed) % 1000 === 0) {
          console.log(`  Progress: ${imported + skipped + failed}/${certificates.length} (Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed})`);
        }
      } catch (err) {
        failed++;
        if (failed <= 5) { // Only log first 5 errors to avoid spam
          console.error(`  Error importing ${cert.certienum}:`, err.message);
        }
      }
    }

    console.log(`  ✓ Imported: ${imported}, ⚠ Skipped: ${skipped}, ✗ Failed: ${failed}`);
    console.log('');
    
    totalProcessed += certificates.length;
    totalImported += imported;
    totalSkipped += skipped;
    totalFailed += failed;
  }

  // Get final database stats
  db.get('SELECT COUNT(*) as total FROM certificates', (err, row) => {
    if (err) {
      console.error('Error getting final count:', err);
    } else {
      console.log(`\n========================================`);
      console.log(`IMPORT COMPLETE!`);
      console.log(`========================================`);
      console.log(`Files processed: ${files.length}`);
      console.log(`Total entries processed: ${totalProcessed}`);
      console.log(`Total imported: ${totalImported}`);
      console.log(`Total skipped (duplicates): ${totalSkipped}`);
      console.log(`Total failed: ${totalFailed}`);
      console.log(`Total certificates in database: ${row.total}`);
      console.log(`========================================\n`);
    }
    
    db.close();
  });
}

// Run import
importCleanedCSVFiles().catch(err => {
  console.error('Import failed:', err);
  db.close();
  process.exit(1);
});