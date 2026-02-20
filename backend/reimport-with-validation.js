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
function isValidCertificate(expiryDate) {
  if (!expiryDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
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
        name: parts[0] ? parts[0].trim() : "",
        certienum: parts[1] ? parts[1].trim() : "",
        coursename: parts[2] ? parts[2].trim() : "",
        expairydate: parts[3] ? parts[3].trim() : ""
      };
    })
    .filter(row => {
      // Only include rows with certificate numbers and valid names
      if (!row.certienum || row.certienum.trim() === "") return false;
      if (!row.name || row.name.trim() === "") return false;
      
      // Exclude if name is actually a course name
      const courseKeywords = ['Fire', 'Safety', 'Training', 'HAZCOM', 'Driving', 'Operator', 'Marshal', 'Warden'];
      const nameIsCourseName = courseKeywords.some(keyword => row.name.includes(keyword) && row.name === row.coursename);
      
      return !nameIsCourseName;
    });

  return parsedRows;
}

// Insert certificate with validation
function insertCertificate(cert) {
  return new Promise((resolve, reject) => {
    // Check if certificate already exists
    db.get('SELECT _id FROM certificates WHERE certienum = ?', [cert.certienum], (err, existing) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (existing) {
        resolve({ skipped: true, reason: 'duplicate' });
        return;
      }
      
      const id = generateId();
      const now = Date.now();
      
      // Calculate status based on expiry date
      const status = isValidCertificate(cert.expairydate) ? 1 : 0;
      
      const query = `
        INSERT INTO certificates (_id, certienum, name, coursename, expairydate, status, _created, _modified, _state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `;
      
      const params = [
        id,
        cert.certienum || null,
        cert.name || null,
        cert.coursename || null,
        cert.expairydate || null,
        status,
        now,
        now
      ];
      
      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ inserted: true, id: id, status: status });
        }
      });
    });
  });
}

// Main import function
async function reimportWithValidation() {
  const csvDir = path.join(__dirname, 'cleaned-csv');
  
  if (!fs.existsSync(csvDir)) {
    console.error('Cleaned CSV directory not found:', csvDir);
    console.log('Please run clean-csv-data.js first.');
    process.exit(1);
  }

  const files = fs.readdirSync(csvDir).filter(f => f.startsWith('cleaned_') && f.endsWith('.csv'));
  console.log(`Found ${files.length} cleaned CSV files\n`);

  let totalProcessed = 0;
  let totalImported = 0;
  let totalValid = 0;
  let totalExpired = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const file of files) {
    console.log(`Processing: ${file}`);
    const filePath = path.join(csvDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const certificates = parseCleanedCSV(content);
    console.log(`  Found ${certificates.length} valid entries`);

    let imported = 0;
    let valid = 0;
    let expired = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      
      try {
        const result = await insertCertificate(cert);
        
        if (result.inserted) {
          imported++;
          if (result.status === 1) {
            valid++;
          } else {
            expired++;
          }
        } else if (result.skipped) {
          skipped++;
        }
        
        if ((imported + skipped + failed) % 1000 === 0) {
          console.log(`  Progress: ${imported + skipped + failed}/${certificates.length}`);
        }
      } catch (err) {
        failed++;
        if (failed <= 5) {
          console.error(`  Error importing ${cert.certienum}:`, err.message);
        }
      }
    }

    console.log(`  ✓ Imported: ${imported} (Valid: ${valid}, Expired: ${expired})`);
    console.log(`  ⚠ Skipped: ${skipped}, ✗ Failed: ${failed}\n`);
    
    totalProcessed += certificates.length;
    totalImported += imported;
    totalValid += valid;
    totalExpired += expired;
    totalSkipped += skipped;
    totalFailed += failed;
  }

  // Get final database stats
  db.all(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as valid_count,
      SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as expired_count,
      SUM(CASE WHEN expairydate IS NULL THEN 1 ELSE 0 END) as no_date_count
    FROM certificates
  `, (err, rows) => {
    if (err) {
      console.error('Error getting final stats:', err);
    } else {
      const stats = rows[0];
      console.log(`\n========================================`);
      console.log(`IMPORT COMPLETE WITH VALIDATION!`);
      console.log(`========================================`);
      console.log(`Files processed: ${files.length}`);
      console.log(`Total entries processed: ${totalProcessed}`);
      console.log(`Total imported: ${totalImported}`);
      console.log(`  - Valid certificates: ${totalValid}`);
      console.log(`  - Expired certificates: ${totalExpired}`);
      console.log(`Total skipped (duplicates): ${totalSkipped}`);
      console.log(`Total failed: ${totalFailed}`);
      console.log(`\nDatabase Statistics:`);
      console.log(`  Total certificates: ${stats.total}`);
      console.log(`  Valid: ${stats.valid_count}`);
      console.log(`  Expired: ${stats.expired_count}`);
      console.log(`  No expiry date: ${stats.no_date_count}`);
      console.log(`========================================\n`);
    }
    
    db.close();
  });
}

// Run import
reimportWithValidation().catch(err => {
  console.error('Import failed:', err);
  db.close();
  process.exit(1);
});