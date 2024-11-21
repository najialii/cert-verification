import React, { useEffect, useState } from "react";

function Certilist() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [totalCertificates, setTotalCertificates] = useState(0);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost/cert-verification/api/content/items/certificates?populate=*&_limit=${pageSize}&_start=${(currentPage - 1) * pageSize}`,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex flex-col items-center p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-400">Certificate List</h1>
        <p className="text-gray-600 mt-2">Manage your uploaded certificates efficiently</p>
      </header>

      {loading && <div className="text-orange-600 font-semibold text-lg">Loading...</div>}
      {error && <div className="text-red-500 font-semibold">{error}</div>}

      {!loading && !error && (
        <div className="w-full max-w-7xl bg-white p-6 rounded-xl shadow-xl">
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
                <thead className="bg-orange-400 text-white">
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
                  className="bg-orange-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>

                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Page</span>
                  <strong className="text-orange-600">{currentPage}</strong>
                  <span className="ml-2 text-gray-700">of {totalPages}</span>
                </div>

                <button
                  className="bg-orange-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
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
