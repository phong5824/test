import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full py-3 z-10">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 font-semibold ml-10">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Giới thiệu
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Tính năng
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Đối tác
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Liên hệ
            </a>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="flex items-center">
              <img
                src="https://shub.edu.vn/images/landing/ver3/header-section/logo.svg"
                alt="SHub Classroom"
                className="h-10"
              />
            </a>
          </div>

          {/* Sign in, Sign up */}
          <div className="hidden md:flex items-center space-x-4 mr-10">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Đăng nhập
            </button>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Đăng ký
            </button>
          </div>

          {/* Hamburger Menu  */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 bg-white shadow-lg rounded-lg">
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Giới thiệu
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Tính năng
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Đối tác
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Liên hệ
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
