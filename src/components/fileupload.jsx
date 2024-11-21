import React, { useState } from "react";

function BulkUpload() {
  const [csvData, setCsvData] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to parse CSV data
  const parseCSV = () => {
    // Split the CSV into rows
    const rows = csvData.trim().split("\n");
    // Extract headers
    const headers = rows[0].split(",").map((header) => header.trim());
    // Map through the rows and create objects based on the headers
    const data = rows.slice(1).map((row) => {
      const values = row.split(",").map((value) => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
    setParsedData(data);
  };

  // Function to handle and format the date correctly (MM/DD/YYYY to YYYY-MM-DD)
  const formatDate = (dateStr) => {
    if (!dateStr) return null;

    // Debug log to check the raw date
    console.log("Raw Date String:", dateStr);

    const dateParts = dateStr.split("/");

    // Ensure there are three parts for month, day, and year
    if (dateParts.length === 3) {
      const formattedDate = new Date(`${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`);
      
      if (formattedDate instanceof Date && !isNaN(formattedDate)) {
        // Return the date in YYYY-MM-DD format
        return formattedDate.toISOString().split("T")[0];
      } else {
        // Log invalid date for debugging
        console.log("Invalid Date:", dateStr);
      }
    }
    
    return null;
  };

  // Function to check certificate expiry status
  const checkExpiryStatus = (expiryDate) => {
    if (!expiryDate) return "Invalid Date";
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry >= today ? "Valid" : "Expired";
  };

  // Function to upload data to Cockpit CMS
  const uploadData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const API_URL = "http://localhost/cert-verification/api/content/item/certificates"; // Replace with your Cockpit base URL
      const API_TOKEN = "Bearer API-d9823105104e4a61de49056e3539b02c7a3519fa"; // Replace with your API token

      // Loop through the parsed data and upload each item
      const promises = parsedData.map((entry) => {
        let formattedExpiryDate = entry["Certificate Expiry Date"];

        if (formattedExpiryDate) {
          // Format the expiry date
          formattedExpiryDate = formatDate(formattedExpiryDate);
        } else {
          formattedExpiryDate = null;
        }

        const expiryStatus = checkExpiryStatus(formattedExpiryDate);

        return fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: API_TOKEN,
          },
          body: JSON.stringify({
            data: {
              certienum: entry["Certificate No."],
              name: entry["Student Name"],
              coursename: entry["Course Name"],
              issuedate: formattedExpiryDate, // Send formatted expiry date
              status: expiryStatus, // Add status based on expiry date
            },
          }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.text().then((text) => {
                console.error(`Failed Entry ${entry["Certificate No."]}:`, text);
                return Promise.reject(`Error: ${res.status} - ${res.statusText}`);
              });
            }
            return res.json();
          })
          .then((json) => {
            console.log(`Entry ${entry["Certificate No."]} successfully uploaded:`, json);
          });
      });

      await Promise.all(promises);
      setSuccess("All entries uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-600">Bulk Upload</h1>
        <p className="text-gray-600 mt-2">
          Paste your CSV data below to upload it to the collection.
        </p>
      </header>

      <textarea
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        rows={10}
        className="w-full max-w-2xl p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
        placeholder="Paste your CSV data here..."
      ></textarea>

      <button
        onClick={parseCSV}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Parse CSV
      </button>

      {parsedData.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-lg font-bold mb-4">Parsed Data:</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(parsedData[0]).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-2 bg-gray-200 text-left"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border border-gray-300 px-4 py-2 text-gray-700">
                      {i === 3 && value ? (
                        // Format the expiry date before rendering
                        formatDate(value)
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={uploadData}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload to CMS"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 font-semibold">
          Error: {error}
        </div>
      )}
      {success && (
        <div className="mt-4 text-green-500 font-semibold">{success}</div>
      )}
    </div>
  );
}

export default BulkUpload;
