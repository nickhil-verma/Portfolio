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
    <nav className="p-2 z-40 sticky top-0 flex justify-between items-center bg-light dark:bg-dark shadow-md transition-colors duration-500">
      <img src={logoSrc} className="w-11 fill-current text-green-600 duration-700" alt="Logo" />
      <ul className="hidden dark:text-white duration-700 md:flex md:space-x-8 md:items-center flex-grow justify-center">
        <a href='#projects'><li className="text-lg  hover:cursor-pointer hover:scale-105 duration-200">Projects</li></a>
        <a href='#achivements'><li className="text-lg hover:cursor-pointer hover:scale-105 duration-200">Achievements</li></a>
        <a href='#contact'><li className="text-lg hover:cursor-pointer hover:scale-105 duration-200">Contact</li></a>
      </ul>
      <button
        className="text-xl p-2 rounded-full focus:outline-none transition-transform duration-800 transform hover:scale-110"
        onClick={changeTheme}
      >
        {theme === 'light' ? <FaMoon className="text-light" /> : <IoSunny className="text-dark" />}
      </button>
    </nav>
  );
};

export default Navbar;
