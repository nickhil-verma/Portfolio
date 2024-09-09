import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './LoadingPage.css';
import LOGO from '../../src/logo.svg';

const LoadingPage = () => {
  const [bgColor, setBgColor] = useState('black'); // Initial background color is black

  useEffect(() => {
    // Set a timeout to change background color and hide the LoadingPage after 2500ms (2.5 seconds)
    const timer = setTimeout(() => {
      setBgColor('white'); // Change background color to white
      setTimeout(() => {
        const loadingPageElement = document.getElementById('LoadingPage');
        
         
        if (loadingPageElement) {
          loadingPageElement.style.display = 'none';
        
        }
      }, 500); // Extra time to allow background color transition
    }, 2800); // Initial delay before background color change

    // Clear the timeout if the component is unmounted before the timeout completes
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
       

      <motion.div
        id='LoadingPage'
        initial={{ y: 0, opacity: 1, rotateY: 0, backgroundColor: 'black' }}
        animate={{ y: -1200, opacity: 0, rotateY: 25, backgroundColor: bgColor }}
        transition={{ delay: 5, duration: 2 }} // Longer duration to include color transition
        className="Loading-page dark:bg-dark text-white dark:text-white w-screen "
      >
        

        <div className="loading-gifholder flex justify-center items-center">
          <motion.img 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.5 }} 
            className="w-28 mr-4" 
            src={LOGO} 
            alt="Logo" 
          />
        
          <div className="text-holder flex">
          <div className="loader">
          <p>loading</p>
          <div className="words">
            <span className="word">Portfolio</span>
            <span className="word">Skills</span>
            <span className="word">Projects</span>
            <span className="word">Achivements</span>
           </div>
        </div>

           

             
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LoadingPage;
