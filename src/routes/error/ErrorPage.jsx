import React from "react";
import { FiRefreshCw, FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const ErrorBoundaryHandler = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-6">
      <div className="max-w-xl text-center bg-white shadow-lg rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
         Page Under Construction
        </h1>
        <p className="text-lg text-gray-600 mb-8">
           This page is currently under development.
        </p>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
          >
            <FiArrowLeftCircle className="text-xl" />
            Go Back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
          >
            <FiRefreshCw className="text-xl animate-spin-slow" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryHandler;
