// src/components/CustomButton.js

import React from 'react';

const CustomButton = ({ text }) => {
  return (
    <div className="relative w-48 h-12 border-2 m-auto my-5 dark:border-white border-black rounded-3xl overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 flex items-center justify-center   bg-yellow transform scale-0 group-hover:scale-100 m-0.5 transition-transform duration-700 rounded-3xl"></div>
      <div className="relative flex items-center justify-center h-full duration-700  dark:text-white hover:text-white text-black font-semibold z-10">
        {text}
      </div>
    </div>
  );
};

export default CustomButton;
