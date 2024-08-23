import React, { useState } from 'react';
import CustomButton from './CustomButton';
import { TypeAnimation } from 'react-type-animation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LOGO from '../img/CF_DP.png';
import VEC1 from '../img/Vector1.png';
import VEC2 from '../img/Vector2.png';
import { FaExternalLinkAlt } from "react-icons/fa";

const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to generate random positions for the blurred divs
  const randomPosition = () => ({
    top: `${Math.floor(Math.random() * 80)}%`,
    left: `${Math.floor(Math.random() * 80)}%`,
  });

  return (
    <>
      <div id="hero" className="relative max-lg:mt-16 flex max-lg:mb-12 flex-col lg:flex-row h-screen bg-light dark:bg-dark duration-700">
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
          className={`fixed inset-0 bg-black bg-opacity-75 z-30 lg:hidden transform ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300`}
        >
          <div className="flex flex-col bg-light dark:bg-dark items-center justify-center h-full dark:text-white">
            <a href="#hero" className="text-2xl mb-4" onClick={toggleMenu}>Home</a>
            <a href="#projects" className="text-2xl mb-4" onClick={toggleMenu}>Projects</a>
            <a href="#contact" className="text-2xl mb-4" onClick={toggleMenu}>Contact</a>
            <a href='https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing' className="text-2xl mb-4" onClick={toggleMenu}>
              <CustomButton text="Resume" />
            </a>
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="relative lg:w-3/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="relative text-center p-8">
            {/* Floating boxes positioned relative to the image */}
            
            <div className="relative z-20">
              {/* Logo Image */}
              <a href='https://www.instagram.com/nickhil_verma?igsh=MWljaDU2bW9kMmZ4dQ%3D%3D&utm_source=qr' className='cursor-pointer'>
                <motion.img
                   initial={{ scale: 1.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3, duration: 0.8 }}
      viewport={{ once: false }}

                  src={LOGO}
                  alt="Hero Image"
                  className="rounded-full hover:scale-105  duration-1000 cursor-pointer  z-40 w-[300px] -top-10 lg:w-[500px]"
                />
              </a>
              <motion.div
      initial={{ x: -110, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.8 }}
      viewport={{ once: false }}  // Trigger animation every time it comes into view
      className="absolute lg:top-20 max-lg:top-24 lg:left-16 -top-20 backdrop-blur-sm bg-white/30 text-white cursor-pointer hover:scale-105 duration-700 w-44 h-10 flex items-center justify-center text-s rounded-lg shadow-lg z-40"
    >
      👨‍💻 Web Developer
    </motion.div>

    <motion.div
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.8 }}
      viewport={{ once: false }}  // Trigger animation every time it comes into view
      className="absolute max-sm:text-xs lg:bottom-16 max-lg:top-44 lg:-right-0 -bottom-10 -right-8 backdrop-blur-sm bg-white/30 text-white cursor-pointer hover:scale-105 duration-700 w-30 h-12 flex items-center justify-center text-s max-sm:top-48 p-2 rounded-lg shadow-lg z-50"
    >
      🥇 Competitive Programmer
    </motion.div>
              {/* VEC1 and VEC2 behind the logo */}
              <img className='absolute -z-10 top-16 left-10 max-sm:left-0' src={VEC1} />
              <img className='absolute -z-10 top-20 left-10 max-sm:left-0 max-sm:top-12' src={VEC2} />
              <motion.div className='bg-bluish top-20 right-0 z-0 blur-3xl w-48 h-48 absolute ' 
              initial={{ x: '0',   opacity: 0.3 }}  // Initial position
              animate={{ x: ['100px', '0px', '100px'], opacity: 0.5 }}  // To and fro in Y direction
              transition={{
                duration: 20, // Speed of the animation
                ease: "easeInOut",  // Smooth easing function
                repeat: Infinity,  // Loop indefinitely
                repeatType: "mirror", // Reverses direction smoothly
              }}
              
              />
              <motion.div className='bg-yellow top-32 right-0 z-0 blur-3xl w-48 h-48 absolute ' 
              initial={{ x: '0',   opacity: 0.5 }}  // Initial position
              animate={{ x: ['-100px', '0px', '-100px'], opacity: 0.7 }}  // To and fro in Y direction
              transition={{
                duration: 20, // Speed of the animation
                ease: "easeInOut",  // Smooth easing function
                repeat: Infinity,  // Loop indefinitely
                repeatType: "mirror", // Reverses direction smoothly
              }}
              
              />
            </div>

          </div>
        </div>

        {/* Left Side (Text) */}
        <div className="lg:w-2/5 w-full flex items-center justify-center bg-light dark:bg-dark duration-700">
          <div className="text-center p-8">
            <h1 className="text-4xl min-h-24 max-sm:text-2xl duration-700 font-bold mb-4 dark:text-white dark:bg-dark">
              HEY👋🏻{' '}
              <TypeAnimation
                sequence={[
                  'Welcome to my Portfolio',
                  2000,
                  'Collaborate Wid me',
                  2000,
                  'Get In Touch!',
                  2000,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ fontSize: '1em', duration: '700', display: 'inline-block', color: 'inherit' }}
              />
            </h1>

            <p className="text-s max-sm:text-sm text-gray-600 dark:text-gray-300 duration-700">
              Hey everyone! 👋 I'm a web developer looking for teammates to collaborate on hackathons. Let's build something amazing together! 💻🚀
            </p>

            {/* Custom Buttons */}
            <div className='flex items-center justify-center space-x-4 max-sm:flex-col max-sm:space-y-4'>
  <a href='https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit?usp=sharing' className='flex justify-center'>
    <CustomButton text="Resume" className="max-sm:w-16 max-sm:h-10" />
  </a>
  <a href="https://www.linkedin.com/in/nikhil-verma-b9ba861b0/" className='hover:scale-105 duration-1000 hover:text-yellow cursor-pointer' ><span className='dark:text-white max-sm:text-xs flex justify-center items-center '>Connect with me &nbsp; <FaExternalLinkAlt /></span></a>
</div>


          </div>
        </div>

        {/* Randomized Blurred Bouncing Divs */}
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            style={{ width: '300px', height: '300px', ...randomPosition() }}
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
