import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Certisearch from "./components/certisearch"
import Certiupload from "./components/certiupload"
import Certilist from "./components/certilist"
import BulkUpload from "./components/fileupload";
import Header from "./components/nav";
import NotFound from "./notfound";
function RouteComponent() {
  return (
    <Router>
      <div className="min-h-screen font-sans">
   
<Header />
        <Routes>
          <Route path="/" element={<Certisearch />} />
          <Route path="/upload" element={<Certiupload />} />
          <Route path="/list" element={<Certilist />} />
          <Route path="/file" element={<BulkUpload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>


        <footer className="bg-gray-800 text-white text-center p-4">
          © hse. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default RouteComponent;
