import React, { useState, useEffect } from 'react';
import { FaMoon } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';
import LOGO from '../../../src/logo.svg';
import DARKLOGO from '../../../src/logoDARK.svg';

const Navbar = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply the theme to the root element (usually the HTML or body element)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const changeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Determine which logo to use based on the theme
  const logoSrc = theme === 'dark' ? DARKLOGO : LOGO;

  return (
    <>
    <nav className=" fixed w-full top-0 p-2 z-40 flex justify-between items-center bg-light dark:bg-dark shadow-md transition-colors duration-500">
      <a href='#'>
        <img src={logoSrc} className="w-11 fill-current text-green-600 duration-700" alt="Logo" />
      </a>
      <ul className="hidden  dark:text-white duration-700 md:flex md:space-x-8 md:items-center flex-grow justify-center">
        <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200"><a className='hover:bor' href='#projects'>Projects</a></li>
        <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200"><a href='#achievements'>Achievements</a></li>
        <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200"><a href='#contact'>Contact</a></li>
      </ul>
      
    </nav>
    <button
       className="fixed top-4 right-4 max-sm:right-20 z-40 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={changeTheme}
      >
        {theme === 'light' ? <FaMoon className="text-light" /> : <IoSunny className="text-dark" />}
      </button>
   </>
  );
};

export default Navbar;
