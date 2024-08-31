import React from 'react';
import { FaGithub, FaReact } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { RiTailwindCssFill } from "react-icons/ri";
import THUMBNAIL from '../img/thumbnailfooter.png';
import { motion } from 'framer-motion';
const text = "Framer Motion is a really cool tool".split(" ");
const Footer = () => {
  return (
    <>
    <div>
    <motion.div
  initial={{ y: '0', x: '0', opacity: 0.5 }}
  animate={{ y: ['300px', '0px', '300px'], opacity: 0.3, backgroundColor: '#1A89E2' }}
  transition={{
    duration: 10,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror",
  }}
  style={{ width: "300px", height: "300px", position: 'absolute', top: '0', left: '0', zIndex: 1 }} // Set zIndex to 1 or adjust as needed
  className="blur-3xl opacity-55 rounded-full"
>
</motion.div>

          <div className="relative  shadow-xl bg-yellow hover:scale-105 duration-1000 z-20 p-5 w-4/5 md:w-7/10 max-w-5xl h-auto m-auto my-9 rounded-xl flex flex-col overflow-hidden lg:flex-row items-center lg:items-start lg:justify-between">
            {/* Motion Div */}
            
            <div className="relative flex-1 mb-4 lg:mb-0 lg:mr-4 text-center lg:text-left">
              <h1 className='text-2xl max-sm:text-s text-white font-semibold mb-2'>
                Liked My <span className='text-red-500'>Portfolio?</span>
              </h1>
              <p className='text-white max-sm:text-xs mb-2'>
                Make this <span className='text-red-500'>Yours</span> By forking.
              </p>
              <p className='text-white max-sm:text-xs mb-4'>
                Fork this template on GitHub and start building your own portfolio website.
              </p>
              <div className='flex flex-col lg:flex-row items-center lg:items-start space-y-2 lg:space-y-0 lg:space-x-4'>
                <a href='https://github.com/nickhil-verma/Portfolio'>
                  <button className='rounded-xl bg-white flex items-center p-2 space-x-2'>
                    <FaGithub />
                    <span>Fork Now</span>
                  </button>
                </a>
                <a href='https://github.com/nickhil-verma/Portfolio'>
                  <button className='bg-black text-white rounded-xl flex h-10 items-center px-5'>
                    <CiStar className="mr-2" /> Like
                  </button>
                </a>
              </div>
            </div>
            <img src={THUMBNAIL} alt="Portfolio" className="w-full hover:cursor-pointer max-w-xs h-auto rounded-xl" />
          </div>
          <div className='bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-between px-5 py-3 md:px-10 md:py-5'>
            <p 
       
          
            className='max-sm:text-xs'>
              
              Made With ❤️ by Nikhil</p>
            <div className='flex items-center justify-center text-center text-s '>
              Using &nbsp; <span className='text-yellow'><FaReact /></span> &nbsp; <span className='text-bluish'>x</span> &nbsp; <span className='text-yellow'><RiTailwindCssFill /></span>
            </div>
          </div>
      </div>
    </>
  );
}

export default Footer;
