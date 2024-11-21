import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-teal-600">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 text-teal-600 font-semibold hover:underline">
        Go Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
