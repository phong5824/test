import React, { useEffect, useState } from "react";
import axios from "axios";

function QueryTask() {
  const [inputData, setInputData] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const inputResponse = await axios.get("http://localhost:5000/input");
        console.log("Input data:", inputResponse.data);
        setInputData(inputResponse.data);

        const processResponse = await axios.post(
          "http://localhost:5000/processAndPost",
          { inputData: inputResponse.data }
        );
        console.log("Processed result:", processResponse.data);
        setResult(processResponse.data.outputData);
      } catch (error) {
        console.error("Error during process:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Query Task</h1>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-lg font-medium text-gray-600">Loading...</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Input Data:
              </h2>
              <pre className="bg-gray-50 text-sm text-gray-800 p-4 rounded border border-gray-300 overflow-x-auto">
                {JSON.stringify(inputData, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Output Data:
              </h2>
              <pre className="bg-gray-50 text-sm text-gray-800 p-4 rounded border border-gray-300 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueryTask;
