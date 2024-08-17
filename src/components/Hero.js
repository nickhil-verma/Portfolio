import React from 'react';
import CustomButton from './CustomButton';
 

const Hero = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-light dark:bg-dark duration-700">
        {/* Right Side (Image) */}
        <div className="md:w-3/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="text-center p-8">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Hero Image"
              className="rounded-lg shadow-lg w-full md:w-auto"
            />
          </div>
        </div>

        {/* Left Side (Text) */}
        <div className="md:w-2/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white duration-700">
              Welcome to Our Website
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 duration-700">
              Discover our amazing services and features that can help you achieve your goals.
            </p>
            
            {/* Custom Buttons */}
            <a href='https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing'><CustomButton text="Resume" /></a>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
