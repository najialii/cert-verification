import { useState } from "react";

function BulkUpload() {
  const [csvData, setCsvData] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  // Function to handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvData(text);
      parseCSVData(text);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
  };

  // Function to parse CSV data
  const parseCSVData = (data) => {
    try {
      // Split the CSV into rows
      const rows = data.trim().split("\n");
      if (rows.length === 0) {
        setError("CSV file is empty");
        return;
      }

      // Extract headers and clean them
      const rawHeaders = rows[0].split(",").map((header) => header.trim().replace(/[^\x20-\x7E]/g, ''));
      console.log("CSV Headers:", rawHeaders);
      
      // Create a mapping for flexible column names
      const headerMap = {};
      rawHeaders.forEach((header, index) => {
        const cleanHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Map various possible column names to standard names
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
      
      console.log("Raw Headers:", rawHeaders);
      console.log("Header Mapping:", headerMap);
      
      // Map through the rows and create objects based on the headers
      const parsedRows = rows.slice(1)
        .filter(row => row.trim() !== "") // Filter out empty rows
        .map((row, rowIndex) => {
          const values = row.split(",").map((value) => value.trim());
          
          return {
            'Student Name': values[headerMap['Student Name']] || values[0] || "",
            'Certificate No.': values[headerMap['Certificate No.']] || values[1] || "",
            'Course Name': values[headerMap['Course Name']] || values[2] || "",
            'Certificate Expiry Date': values[headerMap['Certificate Expiry Date']] || values[3] || ""
          };
        });
      
      setParsedData(parsedRows);
      console.log(`Parsed ${parsedRows.length} entries from CSV`);
      console.log("Sample entry:", parsedRows[0]);
      setSuccess(`Successfully loaded ${parsedRows.length} entries from ${fileName || 'file'}`);
    } catch (err) {
      setError(`Failed to parse CSV: ${err.message}`);
      console.error("CSV parsing error:", err);
    }
  };

  // Function to parse CSV from textarea
  const parseCSV = () => {
    if (!csvData.trim()) {
      setError("Please paste CSV data or upload a file");
      return;
    }
    parseCSVData(csvData);
  };

  // Function to handle and format the date correctly - supports multiple formats
  const formatDate = (dateStr) => {
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
    // Format 3: "/8/23" or "8/8/23" (M/D/YY or MM/DD/YY)
    else if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        let month = parseInt(parts[0]) || 1;
        if (month === 0) month = 1;
        if (month > 12) month = 12;
        
        let day = parseInt(parts[1]) || 1;
        if (day === 0) day = 1;
        if (day > 31) day = 31;
        
        let year = parts[2];
        
        if (!year || year.trim() === "") {
          year = new Date().getFullYear().toString();
        } else if (year.length === 2) {
          year = `20${year}`;
        }
        
        parsedDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    }
    // Format 4: Try direct parsing as fallback
    else {
      parsedDate = new Date(dateStr);
    }

    // Validate and return
    if (parsedDate && parsedDate instanceof Date && !isNaN(parsedDate)) {
      return parsedDate.toISOString().split("T")[0];
    }

    // Only log unparseable dates
    if (dateStr && dateStr.trim() !== "") {
      console.warn("Could not parse date:", dateStr);
    }
    return null;
  };

  // Function to check certificate expiry status from string
  const checkExpiryStatusFromString = (expiryDateStr) => {
    if (!expiryDateStr) return "Unknown";
    
    // Extract year from various formats
    const yearMatch = expiryDateStr.match(/\d{4}/) || expiryDateStr.match(/\d{2}$/);
    if (!yearMatch) return "Valid"; // If no year found, assume valid
    
    let year = parseInt(yearMatch[0]);
    if (year < 100) year += 2000; // Convert 2-digit year
    
    const currentYear = new Date().getFullYear();
    return year >= currentYear ? "Valid" : "Expired";
  };

  // Function to upload data to Cockpit CMS
  const uploadData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);
    setCurrentEntry(0);
    setTotalEntries(parsedData.length);

    try {
      const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/item/certificates`;

      let successCount = 0;
      let failCount = 0;
      const failedEntries = [];

      // Process entries one by one to ensure all are attempted
      for (let i = 0; i < parsedData.length; i++) {
        const entry = parsedData[i];
        
        // Update progress
        setCurrentEntry(i + 1);
        setUploadProgress(Math.round(((i + 1) / parsedData.length) * 100));
        
        // Skip entries without certificate number
        if (!entry["Certificate No."] || entry["Certificate No."].trim() === "") {
          console.log(`Skipping entry ${i + 1}: No certificate number`);
          continue;
        }

        let formattedExpiryDate = entry["Certificate Expiry Date"];
        const rawDate = formattedExpiryDate;
        
        if (formattedExpiryDate && formattedExpiryDate.trim() !== "") {
          formattedExpiryDate = formatDate(formattedExpiryDate);
          
          // Log date conversion for first entry
          if (i === 0) {
            console.log(`Date conversion: "${rawDate}" -> "${formattedExpiryDate}"`);
          }
        } else {
          formattedExpiryDate = null;
        }

        // Calculate status based on formatted date
        let isValid = false;
        if (formattedExpiryDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const expiryDate = new Date(formattedExpiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          isValid = expiryDate >= today;
        }

        try {
          const payload = {
            data: {
              certienum: entry["Certificate No."] || null,
              name: entry["Student Name"] || null,
              coursename: entry["Course Name"] || null,
              expairydate: formattedExpiryDate,
              status: isValid, // Use calculated boolean status
            },
          };
          
          // Log first entry for debugging
          if (i === 0) {
            console.log("First entry raw data:", entry);
            console.log("First entry payload:", JSON.stringify(payload, null, 2));
          }
          
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            successCount++;
            console.log(`✓ Entry ${i + 1}/${parsedData.length}: ${entry["Certificate No."]} uploaded`);
          } else {
            failCount++;
            const errorText = await response.text();
            console.error(`✗ Entry ${i + 1}: ${entry["Certificate No."]} failed`);
            console.error(`Response status: ${response.status}`);
            console.error(`Error details:`, errorText);
            failedEntries.push(entry["Certificate No."]);
          }
        } catch (err) {
          failCount++;
          console.error(`✗ Entry ${i + 1}: ${entry["Certificate No."]} error - ${err.message}`);
          failedEntries.push(entry["Certificate No."]);
        }
      }

      if (failCount === 0) {
        setSuccess(`All ${successCount} entries uploaded successfully!`);
      } else {
        setSuccess(`Uploaded ${successCount} entries. ${failCount} failed.`); 
        setError(`Failed entries: ${failedEntries.join(", ")}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
      setUploadProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-700 mb-2">Bulk Certificate Upload</h1>
          <p className="text-gray-600 text-lg">
            Upload CSV files to import multiple certificates at once
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                📁 Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
                className="block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none focus:border-blue-500 p-3 transition"
              />
              {fileName && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">✓ {fileName}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                📋 Or Paste CSV Data
              </label>
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={5}
                disabled={loading}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Student Name,Certificate No.,Course Name,Certificate Expiry Date&#10;John Doe,AT0123456,Fire Safety,1-Jan-25"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={parseCSV}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              disabled={!csvData.trim() || loading}
            >
              {loading ? "Processing..." : "Parse CSV"}
            </button>
          </div>
        </div>

        {parsedData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                📊 Parsed Data: <span className="text-blue-600">{parsedData.length}</span> entries
              </h2>
              <button
                onClick={uploadData}
                className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    🚀 Upload {parsedData.length} Entries
                  </>
                )}
              </button>
            </div>

            {loading && (
              <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-blue-700">
                    Uploading: {currentEntry} / {totalEntries}
                  </span>
                  <span className="text-2xl font-bold text-blue-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress > 10 && `${uploadProgress}%`}
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto max-h-96 overflow-y-auto border-2 border-gray-200 rounded-lg">
              <table className="w-full table-auto border-collapse">
                <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">#</th>
                    {Object.keys(parsedData[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-3 text-left font-semibold"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 50).map((row, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition">
                      <td className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      {Object.entries(row).map(([key, value], i) => {
                        const isDateColumn = key === 'Certificate Expiry Date';
                        
                        return (
                          <td key={i} className="border border-gray-300 px-4 py-2 text-gray-700">
                            {isDateColumn && value ? (
                              <div>
                                <div className="font-semibold text-blue-600">{value}</div>
                                <div className="text-xs text-gray-500">({checkExpiryStatusFromString(value)})</div>
                              </div>
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 50 && (
              <p className="text-sm text-gray-600 mt-4 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                ℹ️ Showing first 50 of {parsedData.length} entries in preview
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
            <div className="flex items-start">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <h3 className="text-red-800 font-bold mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-green-800 font-bold mb-1">Success</h3>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkUpload;
