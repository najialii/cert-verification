import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";  // Import Toastify
import "react-toastify/dist/ReactToastify.css";  // Import CSS for Toastify

function Certiupload() {
  const [formData, setFormData] = useState({
    certienum: "",
    name: "",
    issuedate: "",
    expairydate: "",
    status: false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate status based on expiry date
      let isValid = false;
      if (formData.expairydate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        const expiryDate = new Date(formData.expairydate);
        expiryDate.setHours(0, 0, 0, 0);
        isValid = expiryDate >= today;
      }

      // Prepare data with null for empty fields
      const submitData = {
        certienum: formData.certienum || null,
        name: formData.name || null,
        coursename: formData.coursename || null,
        expairydate: formData.expairydate || null,
        status: isValid // Auto-calculate based on expiry date
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/item/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: submitData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(`Failed to upload data. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Certificate uploaded successfully!"); 
      console.log("Response Data:", data);
      
      // Reset form after successful upload
      setFormData({
        certienum: "",
        name: "",
        coursename: "",
        issuedate: "",
        expairydate: "",
        status: false,
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "An unexpected error occurred.");  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Upload Certificate</h1>
        <p className="text-gray-600 mt-2">
          Add a new certificate to the collection.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <label htmlFor="certienum" className="block text-gray-700 font-semibold mb-2">
          Certificate No
        </label>
        <input
          id="certienum"
          name="certienum"
          type="text"
          placeholder="e.g., 123456"
          value={formData.certienum}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
          Student Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., John Doe"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <label htmlFor="coursename" className="block text-gray-700 font-semibold mb-2">
          Course Name
        </label>
        <input
          id="coursename"
          name="coursename"
          type="text"
          placeholder="e.g., Course Name"
          value={formData.coursename}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />

        <label htmlFor="expairydate" className="block text-gray-700 font-semibold mb-2">
          Certificate Expiry Date
        </label>
        <input
          id="expairydate"
          name="expairydate"
          type="date"
          value={formData.expairydate}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {formData.expairydate && (
          <div className="mb-4 p-3 rounded-md bg-gray-50 border">
            <p className="text-sm text-gray-600">
              Status: {' '}
              <span className={`font-semibold ${
                new Date(formData.expairydate) >= new Date() ? 'text-green-600' : 'text-red-600'
              }`}>
                {new Date(formData.expairydate) >= new Date() ? '✓ Valid' : '✗ Expired'}
              </span>
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Certificate"}
        </button>
      </form>


      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton pauseOnFocusLoss pauseOnHover />
    </div>
  );
}

export default Certiupload;
