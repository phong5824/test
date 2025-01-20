/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";

const RequestAndFilterExcel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await attemptDownload();
    } catch (err) {
      console.error("Error during file download:", err);
      setError("Error: Unable to process the file.");
    } finally {
      setIsLoading(false);
    }
  };

  const attemptDownload = async () => {
    try {
      const response = await axios.get("http://localhost:5000/download-file", {
        responseType: "blob",
      });

      if (response.status === 200) {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "filtered_sales.xlsx";
        link.click();

        window.URL.revokeObjectURL(fileURL);
      } else {
        console.error("Failed to download file:", response.statusText);
        setError("Error: Unable to process the file.");
      }
    } catch (err) {
      if (retryCount < 3) {
        setRetryCount((prevCount) => prevCount + 1);
        setError(`Network Error: Retrying... (${retryCount + 1}/3)`);
        setTimeout(attemptDownload, 2000); // Thử lại sau 2 giây
      } else {
        setError(
          "Network Error: Failed after multiple attempts. Please check your internet connection."
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Excel Processor
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Click the button below to download the filtered file after processing.
        </p>

        <button
          onClick={handleDownload}
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white ${
            isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300`}
        >
          {isLoading ? "Processing..." : "Download Filtered File"}
        </button>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default RequestAndFilterExcel;
