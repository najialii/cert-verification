import React, { useEffect, useState } from "react";

function Certilist() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/items/certificates?populate=*&_limit=${pageSize}&_start=${(currentPage - 1) * pageSize}`,
          {
            headers: {
              Authorization: "Bearer API-eb29778119234696f32e226d2554f88b73ca8ff5",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch certificates.");
        }

        const data = await response.json();
        if (data && Array.isArray(data)) {
          setCertificates(data);
          const totalCount = data.meta?.total || 0;
          setTotalCertificates(totalCount);
        } else {
          setCertificates([]);
          setTotalCertificates(0);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [currentPage, pageSize]); 

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value)); 
    setCurrentPage(1) 
  };

  const totalPages = Math.ceil(totalCertificates / pageSize);

  const handleDeleteAll = async () => {
    setDeleting(true);
    setError(null);

    try {
      console.log("Fetching all certificates...");
      
      // First, fetch all certificate IDs without limit
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/items/certificates`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch certificates. Status: ${response.status}`);
      }

      const allCertificates = await response.json();
      console.log(`Found ${allCertificates.length} certificates to delete`);
      
      if (!allCertificates || allCertificates.length === 0) {
        alert("No certificates to delete.");
        setDeleting(false);
        setShowDeleteConfirm(false);
        return;
      }

      let deletedCount = 0;
      let failedCount = 0;

      // Delete each certificate one by one
      for (let i = 0; i < allCertificates.length; i++) {
        const cert = allCertificates[i];
        
        try {
          // Try using the save endpoint with _state: 0 to mark as deleted
          const deleteResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/collections/save/certificates`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                _id: cert._id,
                _state: 0  // Mark as deleted
              }),
            }
          );

          if (deleteResponse.ok) {
            deletedCount++;
            if (deletedCount % 100 === 0) {
              console.log(`Progress: ${deletedCount}/${allCertificates.length} deleted`);
            }
          } else {
            failedCount++;
            const errorText = await deleteResponse.text();
            console.error(`Failed to delete ${cert.certienum}:`, errorText);
          }
        } catch (err) {
          failedCount++;
          console.error(`Error deleting ${cert.certienum}:`, err.message);
        }
      }

      console.log(`Deletion complete! Deleted: ${deletedCount}, Failed: ${failedCount}`);
      alert(`Deletion complete!\n✓ Deleted: ${deletedCount}\n✗ Failed: ${failedCount}`);
      
      // Refresh the list
      window.location.reload();
      
    } catch (err) {
      console.error("Delete all failed:", err);
      setError(err.message || "Failed to delete certificates.");
      alert("Error: " + (err.message || "Failed to delete certificates."));
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Certificate List</h1>
        <p className="text-gray-600 mt-2">Manage your uploaded certificates efficiently</p>
        
        <div className="mt-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting || loading}
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {deleting ? "Deleting..." : "🗑️ Delete All Certificates"}
          </button>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>ALL {totalCertificates} certificates</strong>? 
              This action cannot be undone!
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAll}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400"
              >
                {deleting ? "Deleting..." : "Yes, Delete All"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition font-semibold disabled:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="text-blue-600 font-semibold text-lg">Loading...</div>}
      {error && <div className="text-red-500 font-semibold">{error}</div>}

      {!loading && !error && (
        <div className="w-full max-w-7xl  p-6 rounded-xl shadow-xl">
          {certificates.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <label htmlFor="pageSize" className="mr-2 text-gray-700">Entries per page:</label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border border-gray-300 px-4 py-2 rounded-md text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <table className="w-full table-auto text-gray-700">
                <thead className="bg-blue-400 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Certificate No</th>
                    <th className="px-6 py-3 text-left">Student Name</th>
                    <th className="px-6 py-3 text-left">Course Name</th>
                    <th className="px-6 py-3 text-left">Expiry Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
  {certificates.slice(0, pageSize).map((certificate, index) => (
    <tr key={certificate._id} className="hover:bg-gray-50">
      <td className="border px-6 py-3">
        {(currentPage - 1) * pageSize + index + 1}
      </td>
      <td className="border px-6 py-3">{certificate.certienum}</td>
      <td className="border px-6 py-3">{certificate.name}</td>
      <td className="border px-6 py-3">{certificate.coursename}</td>
      <td className="border px-6 py-3">{certificate.expairydate}</td>
      <td className={`border px-6 py-3 font-semibold ${certificate.status ? "text-green-500" : "text-red-500"}`}>
        {certificate.status ? "Valid" : "Invalid"}
      </td>
    </tr>
  ))}
</tbody>

              </table>

              <div className="mt-6 flex justify-between items-center">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>

                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Page</span>
                  <strong className="text-blue-600">{currentPage}</strong>
                  <span className="ml-2 text-gray-700">of {totalPages}</span>
                </div>

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 mt-6">No certificates found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Certilist;
