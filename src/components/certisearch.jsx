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

    toast.info("Searching for certificate...", {
      progress: false,  
      autoClose: false,  
    });

    try {
      const response = await fetch(
        `http://localhost/cert-verification/api/content/items/certificates?populate=*&filter[certienum]=${certificateNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificate data.");
      }

      const data = await response.json();
      console.log("Response Data:", data);

      if (data.length > 0) {
        setCertificate(data[0]);
        toast.success("Certificate found!", {
          progress: false,  
        });
      } else {
        setCertificate(null);
        setError("No certificate found for the provided number.");
        toast.error("No certificate found.", {
          progress: false,  
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An unexpected error occurred.");
      toast.error("Error: " + (err.message || "An unexpected error occurred."), {
        progress: false,  
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex flex-col pb-12">
 
      <div className="sticky top-0 bg-orange-400 shadow-lg z-10 px-4  mb-8">
      <div className="flex justify-center items-center">
      <h2 className="text-gray-900 text-6xl leading-tight font-black mt-20">
      Verify  certificate
      </h2>
      </div>
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300"
        >
          <input
            id="certificateNumber"
            name="certificateNumber"
            type="text"
            placeholder="your keyword here"
            className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70"
          >
            <div className="relative">
             
              <div className="flex items-center justify-center h-3 w-3 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 transition-all">
                <svg className="opacity-0 animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="flex items-center transition-all opacity-1 valid:">
                <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                  {loading ? "Searching..." : "Search"}
                </span>
              </div>
            </div>
          </button>
        </form>
      </div>

      {/* Error or Success Message */}
      {error && (
        <div className="mt-6 text-red-600 text-lg font-medium">{error}</div>
      )}

      {/* Certificate Details */}
      {certificate && (
        <div className="mt-12 w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Certificate Details</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Certificate No:</span> 
              <span>{certificate.certienum}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Student Name:</span> 
              <span>{certificate.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Course Name:</span> 
              <span>{certificate.coursename}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <span className="font-semibold text-gray-900">Expiry Date:</span> 
              <span>{certificate.expairydate}</span>
            </div>
            <div className="flex justify-between items-center pb-3">
              <span className="font-semibold text-gray-900">Status:</span> 
              <span
                className={`font-semibold ${certificate.status ? "text-green-500" : "text-red-500"}`}
              >
                {certificate.status ? "Valid" : "Invalid"}
              </span>
            </div>
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
