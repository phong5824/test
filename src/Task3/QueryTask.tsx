// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function QueryTask() {
//   // Thay đổi kiểu của error thành string | null
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null); // Sửa tại đây

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(
//           "http://localhost:5000/processQueries",
//           {
//             data: [
//               42, 830, 824, 485, 345, 422, 846, 568, 301, 611, 384, 445, 783,
//               774, 113, 768, 576, 846, 339, 547, 839, 599, 981, 47, 999, 828,
//               533, 983, 942, 40, 89, 795, 948, 784, 477, 223, 91, 904, 947, 212,
//               894, 699, 843, 24, 587, 118, 482, 364, 975, 241, 323, 801, 592,
//               449, 258, 865, 143, 557, 664, 571, 212, 511, 764, 865, 831, 787,
//               998, 526, 282, 381, 954, 705, 388, 280, 989, 936, 234, 192, 64,
//               63, 241, 5, 140,
//             ],
//             query: [
//               { type: "2", range: [15, 73] },
//               { type: "1", range: [39, 57] },
//               { type: "1", range: [14, 39] },
//               // Thêm các truy vấn khác vào đây...
//             ],
//           }
//         );

//         console.log("Results received:", response.data.results);
//         setData(response.data.results);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Error"); // Không còn lỗi kiểu dữ liệu nữa
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Query Results</h1>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>{error}</p> // Hiển thị lỗi nếu có
//       ) : (
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//       )}
//     </div>
//   );
// }

// export default QueryTask;
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
