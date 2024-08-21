import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { TypeAnimation } from 'react-type-animation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to generate random positions for the blurred divs
  const randomPosition = () => ({
    top: `${Math.floor(Math.random() * 80)}%`,  // Random position between 0 and 80% for top
    left: `${Math.floor(Math.random() * 80)}%`, // Random position between 0 and 80% for left
  });

  return (
    <>
      <div className="relative max-md:mt-12 flex max-sm:mt-10 flex-col lg:flex-row h-screen bg-light dark:bg-dark duration-700">
 
        {/* Hamburger Menu for Small Devices */}
        <div className={`fixed top-0 right-0 p-4 z-40 lg:hidden`}>
          <button 
            className="bg-white dark:text-white dark:bg-dark p-2 rounded-full" 
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
        
        {/* Side Menu (Visible on Small Devices when hamburger menu is open) */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-75 z-30 lg:hidden transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
        >
          <div className="flex flex-col bg-light dark:bg-dark  items-center justify-center h-full dark:text-white">
            <a href="#hero" className="text-2xl mb-4" onClick={toggleMenu}>Home</a>
            <a href="#projects" className="text-2xl mb-4" onClick={toggleMenu}>Projects</a>
            <a href="#contact" className="text-2xl mb-4" onClick={toggleMenu}>Contact</a>
            <a href='https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing' className="text-2xl mb-4" onClick={toggleMenu}><CustomButton text="Resume"/></a>
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
            <div className='z-20'><img
              src="https://static1.squarespace.com/static/621cb332ab3b8023913d98ec/t/6225879895782f73a1be99aa/1693825153297/Untitled+icon.png?format=1500w"
              alt="Hero Image"
              className="rounded-full shadow-lg  w-[500px] lg:w-[500px]"
            /></div>
          </div>
        </div>

        {/* Left Side (Text) */}
        <div className="lg:w-2/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4 dark:text-white dark:bg-dark duration-700">
              HEY👋🏻 <TypeAnimation
                sequence={[
                  'Welcome to Our Website',
                  2000,
                  'Explore Our Features',
                  2000,
                  'Get In Touch!',
                  2000,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ fontSize: '1em', display: 'inline-block', color: 'inherit' }}
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

        {/* Randomized Blurred Bouncing Divs */}
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            style={{ width: "300px", height: "300px", ...randomPosition() }}
            className="absolute blur-3xl opacity-50 rounded-full bg-yellow-500 z-0"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
          />
        ))}
      </div>
    </>
  );
};

export default Hero;
