import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { TypeAnimation } from 'react-type-animation';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for hamburger and close

const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="relative max-md:mt-12 flex max-sm:mt-10 flex-col lg:flex-row h-screen bg-light dark:bg-dark duration-700">
        
        {/* Hamburger Menu for Small Devices */}
        <div className={`fixed top-0 right-0 p-4 z-50 lg:hidden`}>
          <button 
            className="text-white bg-black p-2 rounded-full" 
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
        
        {/* Side Menu (Visible on Small Devices when hamburger menu is open) */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
        >
          <div className="flex flex-col bg-light  items-center justify-center h-full dark:text-white">
            <a href="#hero" className="text-2xl mb-4" onClick={toggleMenu}>Home</a>
            <a href="#projects" className="text-2xl mb-4" onClick={toggleMenu}>Contact</a>
            <a href="#contact" className="text-2xl mb-4" onClick={toggleMenu}>Contact</a>
            <a href='https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing' className="text-2xl mb-4" onClick={toggleMenu}>Resume</a>
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="relative lg:w-3/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="relative text-center p-8">
            {/* Floating boxes */}
            <div className="absolute top-16 left-10 transform translate-x-1/2 -translate-y-1/2 bg-white w-20 h-10 flex items-center justify-center shadow-lg z-10">React</div>
            <div className="absolute top-16 left-96 transform translate-x-1/2 -translate-y-1/2 bg-white w-20 h-10 flex items-center justify-center shadow-lg z-10">Mongo DB</div>
            <div className="absolute top-64 left-0 transform -translate-x-1/2 translate-y-1/2 bg-white w-20 h-10 flex items-center justify-center shadow-lg z-10">Node JS</div>
            <div className="absolute top-96 left-12 transform -translate-x-1/2 translate-y-1/2 bg-white w-20 h-10 flex items-center justify-center shadow-lg z-10">Node JS</div>
            <img
              src="https://static1.squarespace.com/static/621cb332ab3b8023913d98ec/t/6225879895782f73a1be99aa/1693825153297/Untitled+icon.png?format=1500w"
              alt="Hero Image"
              className="rounded-full shadow-lg w-[500px] lg:w-[500px]"
            />
          </div>
        </div>

        {/* Left Side (Text) */}
        <div className="lg:w-2/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4 dark:text-white duration-700">
              HEY👋🏻 <TypeAnimation
                sequence={[
                  'Welcome to Our Website', // Types 'Welcome to Our Website'
                  2000, // Waits 2s
                  'Explore Our Features', // Types 'Explore Our Features'
                  2000, // Waits 2s
                  'Get In Touch!', // Types 'Get In Touch!'
                  2000, // Waits 2s
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ fontSize: '1em', display: 'inline-block', color: 'inherit' }} // Use color: 'inherit' to maintain the color scheme
              />
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 duration-700">
              Discover our amazing services and features that can help you achieve your goals.
            </p>
            
            {/* Custom Buttons */}
            <a href='https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing'>
              <CustomButton text="Resume" />
            </a>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
