import React from 'react';
import { motion } from 'framer-motion';
import './LoadingPage.css';
import LOGO from '../../src/logo.svg';

const LoadingPage = () => {
  return (
    <>
      <motion.div
        initial={{ y: 0, opacity: 1, rotateY: 0 }}
        whileInView={{ y: -1200, opacity: 0, rotateY: 25 }}
        transition={{ delay: 2, duration: 1 }}
        className="Loading-page dark:bg-dark dark:text-white w-full overflow-hidden"
      >
        <div className="loading-gifholder flex justify-center items-center">
          <motion.img className="w-28 mr-4" src={LOGO} alt="Logo" />

          <div className="text-holder flex">
            <motion.h1
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl font-bold sm:text-xl text-center mr-4"
            >
              Nikhil Verma
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-4xl font-bold text-center mr-4"
            >
              Welcomes You
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-4xl font-bold text-center"
            >
              To His Creativity Space
            </motion.h1>
          </div>
        </div>

        <div id="container">
          <div className="box"></div>
        </div>
      </motion.div>
    </>
  );
};

export default LoadingPage;
