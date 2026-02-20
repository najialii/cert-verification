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

// Simple date validation - just check if it looks like a date
function isValidDateString(dateStr) {
  if (!dateStr || dateStr.trim() === "") return false;
  
  // Check for common date patterns
  const datePatterns = [
    /^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/,  // 1-Aug-24, 20-Jun-26
    /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/,  // 2 August 2025
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,    // 8/8/23
    /^\d{4}-\d{2}-\d{2}$/             // 2024-08-01
  ];
  
  return datePatterns.some(pattern => pattern.test(dateStr.trim()));
}

// Check if certificate is likely valid based on year in date string
function checkExpiryStatus(expiryDateStr) {
  if (!expiryDateStr) return false;
  
  // Extract year from various formats
  const yearMatch = expiryDateStr.match(/\d{4}/) || expiryDateStr.match(/\d{2}$/);
  if (!yearMatch) return true; // If no year found, assume valid
  
  let year = parseInt(yearMatch[0]);
  if (year < 100) year += 2000; // Convert 2-digit year
  
  const currentYear = new Date().getFullYear();
  return year >= currentYear; // Valid if expiry year is current year or later
}

// Parse CSV with minimal processing
function parseCSV(csvContent) {
  const rows = csvContent.trim().split("\n");
  if (rows.length === 0) return [];

  const parsedRows = rows
    .filter(row => row.trim() !== "")
    .map((row, index) => {
      const parts = row.split(",");
      
      // Handle different CSV structures
      let name, certienum, coursename, expairydate;
      
      if (parts.length >= 4) {
        // Standard format: Name, CertNum, Course, Date
        name = parts[0] ? parts[0].trim() : "";
        certienum = parts[1] ? parts[1].trim() : "";
        coursename = parts[2] ? parts[2].trim() : "";
        expairydate = parts[3] ? parts[3].trim() : "";
      } else if (parts.length === 3) {
        // Missing date: Name, CertNum, Course
        name = parts[0] ? parts[0].trim() : "";
        certienum = parts[1] ? parts[1].trim() : "";
        coursename = parts[2] ? parts[2].trim() : "";
        expairydate = "";
      } else {
        return null; // Skip malformed rows
      }
      
      // Skip if no certificate number
      if (!certienum || certienum.trim() === "") {
        return null;
      }
      
      // Clean up the data
      name = name.replace(/^["']|["']$/g, '').trim(); // Remove quotes
      coursename = coursename.replace(/^["']|["']$/g, '').trim();
      expairydate = expairydate.replace(/^["']|["']$/g, '').trim();
      
      return {
        name,
        certienum,
        coursename,
        expairydate: expairydate || null
      };
    })
    .filter(row => row !== null);

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
        resolve({ skipped: true, reason: 'duplicate' });
        return;
      }
      
      const id = generateId();
      const now = Date.now();
      
      // Store expiry date as string, determine status based on year
      const status = checkExpiryStatus(cert.expairydate) ? 1 : 0;
      
      const query = `
        INSERT INTO certificates (_id, certienum, name, coursename, expairydate, status, _created, _modified, _state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `;
      
      const params = [
        id,
        cert.certienum,
        cert.name || null,
        cert.coursename || null,
        cert.expairydate, // Store as original string
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

// Clear existing data and reimport
function clearAndReimport() {
  return new Promise((resolve, reject) => {
    console.log('Clearing existing certificate data...');
    db.run('DELETE FROM certificates', function(err) {
      if (err) {
        reject(err);
      } else {
        console.log(`Cleared ${this.changes} existing records`);
        resolve();
      }
    });
  });
}

// Main import function
async function importCSVAsStrings() {
  const csvDir = path.join(__dirname, '..', 'certificates hse');
  
  if (!fs.existsSync(csvDir)) {
    console.error('CSV directory not found:', csvDir);
    process.exit(1);
  }

  const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));
  console.log(`Found ${files.length} CSV files\n`);

  // Clear existing data first
  await clearAndReimport();

  let totalProcessed = 0;
  let totalImported = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const file of files) {
    console.log(`\nProcessing: ${file}`);
    const filePath = path.join(csvDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const certificates = parseCSV(content);
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
        
        if ((imported + skipped + failed) % 2000 === 0) {
          console.log(`  Progress: ${imported + skipped + failed}/${certificates.length}`);
        }
      } catch (err) {
        failed++;
        if (failed <= 3) {
          console.error(`  Error importing ${cert.certienum}:`, err.message);
        }
      }
    }

    console.log(`  ✓ Imported: ${imported}, ⚠ Skipped: ${skipped}, ✗ Failed: ${failed}`);
    
    totalProcessed += certificates.length;
    totalImported += imported;
    totalSkipped += skipped;
    totalFailed += failed;
  }

  // Final stats
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
      
      // Show some sample records with dates
      console.log(`\nSample records with expiry dates:`);
      db.all(`
        SELECT certienum, name, coursename, expairydate 
        FROM certificates 
        WHERE expairydate IS NOT NULL AND expairydate != ''
        LIMIT 10
      `, (err, samples) => {
        if (!err && samples.length > 0) {
          samples.forEach(sample => {
            console.log(`  ${sample.certienum}: ${sample.name} - ${sample.coursename} (Expires: ${sample.expairydate})`);
          });
        }
        console.log(`========================================\n`);
        db.close();
      });
    }
  });
}

// Run import
importCSVAsStrings().catch(err => {
  console.error('Import failed:', err);
  db.close();
  process.exit(1);
});