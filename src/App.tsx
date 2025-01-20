import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShubWeb from "./Task2/Shub.tsx";
import RequestAndFilterExcel from "./Task1/RequestAndFilter.tsx";
import QueryTask from "./Task3/QueryTask.tsx";
import Home from "./Home.tsx";

function App() {
  return (
    <div className="h-screen w-screen overflow-auto">
      <BrowserRouter>
        {/* <HandleLoginStatus cookies={cookies}> */}
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/task1" element={<RequestAndFilterExcel />} />
            <Route path="/task2" element={<ShubWeb />} />
            <Route path="/task3" element={<QueryTask />} />
          </Route>
        </Routes>
        {/* </HandleLoginStatus> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
