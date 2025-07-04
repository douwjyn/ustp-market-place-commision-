import React from "react";

export default function Loader() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
      aria-live="assertive"
      aria-label="Loading, please wait..."
    >
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}
