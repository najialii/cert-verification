const fs = require('fs');
const path = require('path');

// Enhanced date formatting function
function formatDate(dateStr) {
  if (!dateStr || dateStr.trim() === "") return null;

  dateStr = dateStr.trim();
  let parsedDate = null;

  // Format 1: "6-Jan-23", "1-Aug-24", "20-Jun-26" (day-month(name)-year with dash)
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    
    // Handle missing day like "-Nov-26"
    if (parts.length === 3 && parts[0] === "") {
      parts[0] = "1"; // Default to 1st day
    }
    
    if (parts.length === 3) {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthNamesAlt = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
      
      // Handle common misspellings
      const monthMisspellings = {
        "augsut": "aug",
        "agust": "aug",
        "septemper": "sep",
        "ocotber": "oct",
        "novemper": "nov",
        "decemper": "dec"
      };
      
      let middleLower = parts[1].toLowerCase().replace(/[^a-z]/g, ''); // Remove non-letters
      
      // Check for misspellings first
      if (monthMisspellings[middleLower]) {
        middleLower = monthMisspellings[middleLower];
      }
      
      // Check if it's a month name
      let monthIndex = monthNames.indexOf(middleLower);
      if (monthIndex === -1) {
        monthIndex = monthNamesAlt.indexOf(middleLower);
      }
      
      if (monthIndex !== -1) {
        // Format: "6-Jan-23" or "0-Aug-25" (handle invalid day)
        let day = parseInt(parts[0]) || 1; // Default to 1 if invalid or 0
        if (day === 0) day = 1; // Fix "0-Aug-25" to "1-Aug-25"
        if (day > 31) day = 31; // Cap at 31
        
        let year = parts[2];
        
        // Handle 2-digit vs 4-digit year
        if (year.length === 2) {
          year = `20${year}`;
        }
        
        parsedDate = new Date(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      } else {
        // Format: "28-06-23" (DD-MM-YY) - numeric month
        let day = parseInt(parts[0]) || 1;
        if (day === 0) day = 1;
        if (day > 31) day = 31;
        
        let month = parseInt(parts[1]) || 1;
        if (month === 0) month = 1;
        if (month > 12) month = 12;
        
        let year = parts[2];
        
        if (year.length === 2) {
          year = `20${year}`;
        }
        
        parsedDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    }
  }
  // Format 2: "2 August 2025" or "2 Augsut 2025" (with spaces)
  else if (dateStr.includes(" ")) {
    const parts = dateStr.split(/\s+/);
    if (parts.length >= 3) {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthNamesAlt = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
      
      // Handle common misspellings
      const monthMisspellings = {
        "augsut": "august",
        "agust": "august",
        "septemper": "september",
        "ocotber": "october",
        "novemper": "november",
        "decemper": "december"
      };
      
      let monthLower = parts[1].toLowerCase().replace(/[^a-z]/g, '');
      
      // Check for misspellings first
      if (monthMisspellings[monthLower]) {
        monthLower = monthMisspellings[monthLower];
      }
      
      let monthIndex = monthNames.indexOf(monthLower.substring(0, 3));
      if (monthIndex === -1) {
        monthIndex = monthNamesAlt.indexOf(monthLower);
      }
      
      if (monthIndex !== -1) {
        let day = parseInt(parts[0]) || 1;
        if (day === 0) day = 1;
        if (day > 31) day = 31;
        
        let year = parts[2];
        parsedDate = new Date(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    }
  }

  // Validate and return
  if (parsedDate && parsedDate instanceof Date && !isNaN(parsedDate)) {
    return parsedDate.toISOString().split("T")[0];
  }

  return null;
}

// Clean and standardize CSV data
function cleanCSVData(csvContent) {
  const lines = csvContent.split('\n');
  const cleanedLines = [];
  let issuesFound = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return; // Skip empty lines
    
    const parts = line.split(',');
    if (parts.length < 3) {
      issuesFound.push(`Line ${index + 1}: Incomplete data - ${line}`);
      return;
    }
    
    // Extract and clean data
    let name = parts[0] ? parts[0].trim() : '';
    let certNumber = parts[1] ? parts[1].trim() : '';
    let course = parts[2] ? parts[2].trim() : '';
    let expiryDate = parts[3] ? parts[3].trim() : '';
    
    // Skip if no certificate number
    if (!certNumber) {
      issuesFound.push(`Line ${index + 1}: Missing certificate number - ${line}`);
      return;
    }
    
    // Clean name (remove extra spaces, fix encoding issues)
    name = name.replace(/\s+/g, ' ').trim();
    
    // Clean course name
    course = course.replace(/\s+/g, ' ').trim();
    
    // Format expiry date
    let formattedDate = '';
    if (expiryDate) {
      const formatted = formatDate(expiryDate);
      if (formatted) {
        formattedDate = formatted;
      } else {
        issuesFound.push(`Line ${index + 1}: Could not parse date "${expiryDate}" for ${certNumber}`);
        formattedDate = ''; // Leave empty if can't parse
      }
    }
    
    // Create cleaned line
    const cleanedLine = `${name},${certNumber},${course},${formattedDate}`;
    cleanedLines.push(cleanedLine);
  });
  
  return {
    cleanedData: cleanedLines.join('\n'),
    issues: issuesFound,
    originalLines: lines.length,
    cleanedLines: cleanedLines.length
  };
}

// Process all CSV files
function processAllCSVFiles() {
  const csvDir = path.join(__dirname, '..', 'certificates hse');
  const outputDir = path.join(__dirname, 'cleaned-csv');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  if (!fs.existsSync(csvDir)) {
    console.error('CSV directory not found:', csvDir);
    return;
  }

  const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));
  console.log(`Found ${files.length} CSV files to process\n`);

  let totalOriginalLines = 0;
  let totalCleanedLines = 0;
  let totalIssues = 0;

  files.forEach(file => {
    console.log(`Processing: ${file}`);
    const filePath = path.join(csvDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const result = cleanCSVData(content);
    
    // Write cleaned file
    const outputFile = path.join(outputDir, `cleaned_${file}`);
    fs.writeFileSync(outputFile, result.cleanedData);
    
    // Write issues report
    if (result.issues.length > 0) {
      const issuesFile = path.join(outputDir, `issues_${file.replace('.csv', '.txt')}`);
      fs.writeFileSync(issuesFile, result.issues.join('\n'));
    }
    
    console.log(`  Original lines: ${result.originalLines}`);
    console.log(`  Cleaned lines: ${result.cleanedLines}`);
    console.log(`  Issues found: ${result.issues.length}`);
    console.log(`  Output: ${outputFile}`);
    
    if (result.issues.length > 0) {
      console.log(`  Issues report: issues_${file.replace('.csv', '.txt')}`);
    }
    
    console.log('');
    
    totalOriginalLines += result.originalLines;
    totalCleanedLines += result.cleanedLines;
    totalIssues += result.issues.length;
  });

  console.log('========================================');
  console.log('CLEANING SUMMARY');
  console.log('========================================');
  console.log(`Files processed: ${files.length}`);
  console.log(`Total original lines: ${totalOriginalLines}`);
  console.log(`Total cleaned lines: ${totalCleanedLines}`);
  console.log(`Total issues found: ${totalIssues}`);
  console.log(`Cleaned files saved to: ${outputDir}`);
  console.log('========================================');
}

// Run the cleaning process
processAllCSVFiles();