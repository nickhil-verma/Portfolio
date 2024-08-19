import React from 'react';
import { FaGithub } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

const Footer = () => {
  return (
    <>
      <div className="bg-yellow p-5 w-4/5 md:w-7/10 max-w-5xl h-auto m-auto my-9 rounded-xl flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
        <div className="flex-1 mb-4 lg:mb-0 lg:mr-4 text-center lg:text-left">
          <h1 className='text-2xl text-white font-semibold mb-2'>
            Liked My <span className='text-red-500'>Portfolio?</span>
          </h1>
          <p className='text-white mb-2'>
            Make this <span className='text-red-500'>Yours</span> By forking.
          </p>
          <p className='text-white mb-4'>
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
        <img src="https://via.placeholder.com/200x100" alt="Portfolio" className="w-full max-w-xs h-auto rounded-xl" />
      </div>
      <div className='bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-between px-5 py-3 md:px-10 md:py-5'>
        <p>Made With ❤️ by Nikhil</p>
        <span>Using React x Tailwind</span>
      </div>
    </>
  );
}

export default Footer;
