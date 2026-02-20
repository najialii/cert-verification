import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Certisearch() {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const certificateNumber = e.target.certificateNumber.value.trim();

    toast.info("Searching for certificate...", { progress: false, autoClose: false });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/items/certificates?filter[certienum]=${certificateNumber}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch certificate data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Certificate Data:", data);

      if (data && data.length > 0) {
        const cert = data[0];
        
        // Recalculate status based on current date
        let isValid = false;
        if (cert.expairydate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const expiryDate = new Date(cert.expairydate);
          expiryDate.setHours(0, 0, 0, 0);
          isValid = expiryDate >= today;
        }
        
        // Update certificate with recalculated status
        cert.status = isValid;
        
        setCertificate(cert);
        toast.success("Certificate found!", { progress: false });
      } else {
        setCertificate(null);
        setError("No certificate found for the provided number.");
        toast.error("No certificate found.", { progress: false });
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An unexpected error occurred.");
      toast.error("Error: " + (err.message || "An unexpected error occurred."), { progress: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <center>
        <h1 style={{ marginBottom: '30px', fontSize: '32px' }}>Student Search</h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          maxWidth: '800px', 
          minHeight: '400px',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <input
              id="certificateNumber"
              name="certificateNumber"
              type="text"
              placeholder="Enter Certificate Number"
              style={{
                padding: '8px 12px',
                width: '300px',
                border: '1px solid #ccc',
                marginRight: '10px'
              }}
              required
            />
            <button 
              type="submit"
              style={{
                padding: '8px 20px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                cursor: 'pointer'
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && (
            <p style={{ color: 'red', marginTop: '20px' }}><b>{error}</b></p>
          )}

          {certificate && (
            <div style={{ marginTop: '30px' }}>
              <table border="1" cellPadding="10" cellSpacing="0" style={{ margin: '0 auto', width: '100%' }}>
                <tbody>
                  <tr>
                    <td><b>Certificate No:</b></td>
                    <td>{certificate.certienum}</td>
                  </tr>
                  <tr>
                    <td><b>Student Name:</b></td>
                    <td>{certificate.name}</td>
                  </tr>
                  <tr>
                    <td><b>Course Name:</b></td>
                    <td>{certificate.coursename}</td>
                  </tr>
                  <tr>
                    <td><b>Expiry Date:</b></td>
                    <td>{certificate.expairydate || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td><b>Status:</b></td>
                    <td>
                      <font color="green">
                        <b>Valid</b>
                      </font>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </center>

      <ToastContainer />
    </div>
  );
}

export default Certisearch;
