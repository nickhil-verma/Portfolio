import React, { useState, useEffect } from 'react';
import { FaMoon } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';
import { FaSearch } from "react-icons/fa";
import LOGO from '../../../src/logo.svg';
import DARKLOGO from '../../../src/logoDARK.svg';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const changeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const logoSrc = theme === 'dark' ? DARKLOGO : LOGO;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setRepos([]); // Clear the list if no input
  };

  return (
    <>
      <nav className="fixed w-screen top-0 p-2 z-40 flex justify-between items-center bg-light dark:bg-dark shadow-md transition-colors duration-500">
        <a href='#'>
          <img src={logoSrc} className="w-11 fill-current text-green-600 duration-700" alt="Logo" />
        </a>
        <ul className="hidden dark:text-white duration-700 md:flex md:space-x-8 md:items-center flex-grow justify-center">
          <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200"><a className='hover:bor' href='#projects'>Projects</a></li>
          <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200"><a href='#achievements'>Achievements</a></li>
          <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200"><a href='#contact'>Contact</a></li>
          {/* Search bar */}
          <li className="relative text-lg">
            <input
              type="text"
              placeholder="Search Projects ... "
              value={searchQuery}
              onChange={handleSearch}
              className="focus:border-yellow-500 border-[1px] bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md font-mono tracking-tighter	 max-lg:hidden focus:outline-none transition-colors duration-200"
            /> 
            <FaSearch className="absolute top-1/2 right-3 max-lg:hidden transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {/* Display repo list if there are search results */}
            {repos.length > 0 && (
              <div className="absolute z-40 bg-white/10 backdrop-blur-md dark:bg-black/10 p-4 max-h-64 w-full overflow-y-auto rounded-sm shadow-lg">
                <ul>
                  {repos.map(repo => (
                    <li key={repo.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">
                        {repo.name}
                      </a>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{repo.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
      <button
        className="fixed top-4 right-4 max-lg:right-20 z-40 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={changeTheme}
      >
        {theme === 'light' ? <FaMoon className="text-light" /> : <IoSunny className="text-dark" />}
      </button>
    </>
  );
};

export default Navbar;
