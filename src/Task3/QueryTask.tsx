import React, { useEffect, useState } from "react";
import axios from "axios";

function QueryTask() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/input");
        console.log("Data received:", response.data); // Log dữ liệu nhận được
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error); // Log lỗi nếu có
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Check API Input</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default QueryTask;
