import React from "react";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

const tasks: Task[] = [
  {
    id: 1,
    title: "Task 1",
    description: `Đọc file sheet từ url (Gọi request để lấy file). Lọc ra tất cả các hàng có giá trị của cột "Sales" > 50.000. Tạo file sheet mới chứa tất cả các hàng vừa lọc được và và lưu file.`,
    status: "completed",
  },
  {
    id: 2,
    title: "Task 2",
    description: `Code lại giao diện của section "Hoạt động tiêu biểu từ cộng đồng giáo dục" từ trang landing page của Shub.`,
    status: "completed",
  },
  {
    id: 3,
    title: "Task 3",
    description:
      "Gọi API lấy dữ liệu và thực hiện truy vấn theo input vừa lấy được, kết quả được trả về dưới dạng bảng và gọi API đẩy dữ liệu kết quả lên output.",
    status: "in-progress",
  },
];

function Home() {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-lg text-gray-600">Nguyen Tuan Phong</p>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  <Link to={`/task${task.id}`}>{task.title}</Link>
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.replace("-", " ")}
                </span>
              </div>
              <p className="text-gray-600">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
