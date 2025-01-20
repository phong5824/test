import React from "react";
import Carousel from "./Carousel.tsx";
import Navbar from "./Navbar.tsx";

const images = [
  "https://picsum.photos/800/1200?random=1",
  "https://picsum.photos/800/1200?random=2",
  "https://picsum.photos/800/1200?random=3",
  "https://picsum.photos/800/1200?random=4",
  "https://picsum.photos/800/1200?random=5",
  "https://picsum.photos/800/1200?random=6",
  "https://picsum.photos/800/1200?random=7",
  "https://picsum.photos/800/1200?random=8",
  "https://picsum.photos/800/1200?random=9",
  "https://picsum.photos/800/1200?random=10",
];

function ShubWeb() {
  return (
    <div className="w-full bg-white">
      <Navbar />
      <main className="pt-24 w-full mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4 mt-8">
            <img
              src="https://shub.edu.vn/_next/image?url=%2Fimages%2Flanding%2Fver3%2Fimage-section%2Fnetworking.gif&w=64&q=75"
              alt="Chain Icon"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Hoạt động tiêu biểu từ cộng đồng giáo dục
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hình ảnh được chính những giáo viên từ khắp 3 miền ghi lại trong quá
            trình giảng dạy, dạy học ứng dụng công nghệ SHub Classroom.
          </p>
        </div>

        {/* Carousel Section */}
        <section className="mb-20">
          <div className="h-[480px]">
            {" "}
            <Carousel images={images} />
          </div>{" "}
        </section>
      </main>
    </div>
  );
}

export default ShubWeb;
