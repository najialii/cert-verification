import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Certisearch() {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedCertificate, setEditedCertificate] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const certificateNumber = e.target.certificateNumber.value.trim();

    toast.info("Searching for certificate...", { progress: false, autoClose: false });

    try {
      const response = await fetch(
        `http://localhost/cert-verification/api/content/items/certificates?populate=*&filter[certienum]=${certificateNumber}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch certificate data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Certificate Data:", data);

      if (data && data.length > 0) {
        setCertificate(data[0]);
        setEditedCertificate(data[0]);
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCertificate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedCertificate.certienum || !editedCertificate.name || !editedCertificate.coursename) {
      toast.error("All fields must be filled!");
      return;
    }

    try {
      if (!certificate._id) {
        throw new Error("Certificate ID is missing.");
      }

      toast.info("Updating certificate...");
      const response = await fetch(
        `http://localhost/cert-verification/api/collections/save/certificates`, 
        {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: certificate._id, 
            certienum: editedCertificate.certienum,
            name: editedCertificate.name,
            coursename: editedCertificate.coursename,
            expairydate: editedCertificate.expairydate,
            status: editedCertificate.status,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response Status:", response.status);
        console.error("Error Text:", errorText);
        throw new Error(`Failed to update certificate. Status: ${response.status}`);
      }

      const updatedData = await response.json();
      setCertificate(updatedData);
      setEditMode(false);
      toast.success("Certificate updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to update certificate.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col pb-12">
      <div className="z-10 px-4 mb-8">
        <div className="flex justify-center items-center">
          <h2 className="text-blue-600 text-4xl leading-tight font-bold mt-20">Student Search</h2>
        </div>
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
        >
          <input
            id="certificateNumber"
            name="certificateNumber"
            type="text"
            placeholder="Enter certificate number"
            className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
            required
          />
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {error && <div className="mt-6 text-red-600 text-lg font-medium">{error}</div>}

      {certificate && (
        <div className="mt-12 w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Certificate Details</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Certificate No:</span>
              {editMode ? (
                <input
                  type="text"
                  name="certienum"
                  value={editedCertificate.certienum}
                  onChange={handleEditChange}
                  className="border rounded-md p-1"
                />
              ) : (
                <span>{certificate.certienum}</span>
              )}
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Student Name:</span>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={editedCertificate.name}
                  onChange={handleEditChange}
                  className="border rounded-md p-1"
                />
              ) : (
                <span>{certificate.name}</span>
              )}
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Course Name:</span>
              {editMode ? (
                <input
                  type="text"
                  name="coursename"
                  value={editedCertificate.coursename}
                  onChange={handleEditChange}
                  className="border rounded-md p-1"
                />
              ) : (
                <span>{certificate.coursename}</span>
              )}
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Expiry Date:</span>
              {editMode ? (
                <input
                  type="text"
                  name="expairydate"
                  value={editedCertificate.expairydate}
                  onChange={handleEditChange}
                  className="border rounded-md p-1"
                />
              ) : (
                <span>{certificate.expairydate}</span>
              )}
            </div>
            <div className="flex justify-between items-center pb-3">
              <span className="font-semibold text-gray-900">Status:</span>
              {editMode ? (
                <select
                  name="status"
                  value={editedCertificate.status}
                  onChange={handleEditChange}
                  className="border rounded-md p-1"
                >
                  <option value="true">Valid</option>
                  <option value="false">Invalid</option>
                </select>
              ) : (
                <span
                  className={`font-semibold ${certificate.status ? "text-green-500" : "text-red-500"}`}
                >
                  {certificate.status ? "Valid" : "Invalid"}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>&copy; 2024 HSE . All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default Certisearch;
