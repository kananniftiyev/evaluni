import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Assuming your general styles are here

const images = ["/uni2.jpg", "/uni3.jpg", "uni.jpg"];

function IndexPage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden m-0 p-0">
      {/* Background Images with Blur and Scale */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full top-0 left-0 bg-cover bg-center transition-all duration-1500 ease-in-out transform ${
            index === currentImage ? "opacity-100 scale-105" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image})`,
            filter: index === currentImage ? "blur(6px)" : "blur(0)",
          }}
        ></div>
      ))}

      {/* Overlay Gradient */}
      <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

      {/* Content Section */}
      <div className="relative w-full h-full flex flex-col justify-end items-center z-10 text-center text-white px-6 pb-12">
        <h1 className="text-5xl font-bold mb-6">
          Your Exam Journey Starts Here
        </h1>
        <p className="text-lg max-w-xl mb-8">
          Simplify exam creation, management, and submission all in one
          platform.
        </p>

        {/* Buttons Section */}
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-full revoult-white revoult-black-text hover:bg-gray-300 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-full revoult-blue revoult-white-text hover:bg-blue-600 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
