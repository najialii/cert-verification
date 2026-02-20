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

// Format date function - handles multiple formats
function formatDate(dateStr) {
  if (!dateStr || dateStr.trim() === "") return null;

  dateStr = dateStr.trim();
  let parsedDate = null;

  // Format 1: "6-Jan-23" or "28-06-23" (day-month-year with dash)
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    
    if (parts.length === 3 && parts[0] === "") {
      parts[0] = "1";
    }
    
    if (parts.length === 3) {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthNamesAlt = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
      const middleLower = parts[1].toLowerCase().replace(/[^a-z]/g, '');
      
      let monthIndex = monthNames.indexOf(middleLower);
      if (monthIndex === -1) {
        monthIndex = monthNamesAlt.indexOf(middleLower);
      }
      
      if (monthIndex !== -1) {
        let day = parseInt(parts[0]) || 1;
        let year = parts[2];
        
        if (year.length === 2) {
          year = `20${year}`;
        }
        
        parsedDate = new Date(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      } else {
        let day = parseInt(parts[0]) || 1;
        let month = parseInt(parts[1]) || 1;
        let year = parts[2];
        
        if (year.length === 2) {
          year = `20${year}`;
        }
        
        parsedDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    }
  }
  // Format 2: "2 August 2025" (with spaces)
  else if (dateStr.includes(" ")) {
    const parts = dateStr.split(/\s+/);
    if (parts.length >= 3) {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthLower = parts[1].toLowerCase().replace(/[^a-z]/g, '');
      
      let monthIndex = monthNames.indexOf(monthLower.substring(0, 3));
      
      if (monthIndex !== -1) {
        let day = parseInt(parts[0]) || 1;
        let year = parts[2];
        parsedDate = new Date(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    }
  }
  // Format 3: "/8/23" or "8/8/23"
  else if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const month = parseInt(parts[0]) || 1;
      const day = parseInt(parts[1]) || 1;
      let year = parts[2];
      
      if (!year || year.trim() === "") {
        year = new Date().getFullYear().toString();
      } else if (year.length === 2) {
        year = `20${year}`;
      }
      
      parsedDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
  }

  if (parsedDate && parsedDate instanceof Date && !isNaN(parsedDate)) {
    return parsedDate.toISOString().split("T")[0];
  }

  return null;
}

// Check if date is valid
function checkExpiryStatus(expiryDate) {
  if (!expiryDate) return false;
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry >= today;
}

// Parse CSV
function parseCSV(csvContent) {
  const rows = csvContent.trim().split("\n");
  if (rows.length === 0) return [];

  const rawHeaders = rows[0].split(",").map(h => h.trim().replace(/[^\x20-\x7E]/g, ''));
  
  const headerMap = {};
  rawHeaders.forEach((header, index) => {
    const cleanHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (cleanHeader.includes('student') && cleanHeader.includes('name')) {
      headerMap['Student Name'] = index;
    } else if (cleanHeader.includes('name') && !headerMap['Student Name']) {
      headerMap['Student Name'] = index;
    }
    
    if (cleanHeader.includes('certif') && cleanHeader.includes('no')) {
      headerMap['Certificate No.'] = index;
    } else if (cleanHeader.includes('certificate') && cleanHeader.includes('no')) {
      headerMap['Certificate No.'] = index;
    }
    
    if (cleanHeader.includes('course')) {
      headerMap['Course Name'] = index;
    }
    
    if (cleanHeader.includes('expir') || (cleanHeader.includes('date') && index > 2)) {
      headerMap['Certificate Expiry Date'] = index;
    }
  });

  const parsedRows = rows.slice(1)
    .filter(row => row.trim() !== "")
    .map(row => {
      const values = row.split(",").map(v => v.trim());
      
      return {
        'Student Name': values[headerMap['Student Name']] || values[0] || "",
        'Certificate No.': values[headerMap['Certificate No.']] || values[1] || "",
        'Course Name': values[headerMap['Course Name']] || values[2] || "",
        'Certificate Expiry Date': values[headerMap['Certificate Expiry Date']] || values[3] || ""
      };
    });

  return parsedRows;
}

// Insert certificate
function insertCertificate(cert) {
  return new Promise((resolve, reject) => {
    const id = generateId();
    const now = Date.now();
    
    let formattedDate = null;
    if (cert['Certificate Expiry Date']) {
      formattedDate = formatDate(cert['Certificate Expiry Date']);
    }
    
    const status = checkExpiryStatus(formattedDate) ? 1 : 0;
    
    const query = `
      INSERT INTO certificates (_id, certienum, name, coursename, expairydate, status, _created, _modified, _state)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    
    const params = [
      id,
      cert['Certificate No.'] || null,
      cert['Student Name'] || null,
      cert['Course Name'] || null,
      formattedDate,
      status,
      now,
      now
    ];
    
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
}

// Main import function
async function importCSVFiles() {
  const csvDir = path.join(__dirname, '..', 'certificates hse');
  
  if (!fs.existsSync(csvDir)) {
    console.error('CSV directory not found:', csvDir);
    process.exit(1);
  }

  const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));
  console.log(`Found ${files.length} CSV files`);

  let totalImported = 0;
  let totalFailed = 0;

  for (const file of files) {
    console.log(`\nProcessing: ${file}`);
    const filePath = path.join(csvDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const certificates = parseCSV(content);
    console.log(`  Found ${certificates.length} entries`);

    let imported = 0;
    let failed = 0;

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      
      if (!cert['Certificate No.'] || cert['Certificate No.'].trim() === '') {
        failed++;
        continue;
      }

      try {
        await insertCertificate(cert);
        imported++;
        
        if (imported % 500 === 0) {
          console.log(`  Progress: ${imported}/${certificates.length}`);
        }
      } catch (err) {
        failed++;
        console.error(`  Error importing ${cert['Certificate No.']}:`, err.message);
      }
    }

    console.log(`  ✓ Imported: ${imported}, ✗ Failed: ${failed}`);
    totalImported += imported;
    totalFailed += failed;
  }

  console.log(`\n========================================`);
  console.log(`IMPORT COMPLETE!`);
  console.log(`Total Imported: ${totalImported}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log(`========================================\n`);

  db.close();
}

// Run import
importCSVFiles().catch(err => {
  console.error('Import failed:', err);
  db.close();
  process.exit(1);
});
