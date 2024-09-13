import React, { useState, useEffect } from 'react';
import { FaMoon, FaSearch, FaTimes } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';
import LOGO from '../../../src/logo.svg';
import DARKLOGO from '../../../src/logoDARK.svg';
import projectsData from './projects.json';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control the modal

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

    const filtered = projectsData.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProjects(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProjects([]);
    setIsFocused(false);
  };

  const openSearchModal = () => {
    setShowModal(true);
    setIsFocused(true);
  };

  const closeSearchModal = () => {
    setShowModal(false);
    setSearchQuery('');
    setFilteredProjects([]);
    setIsFocused(false);
  };

  return (
    <>
      <nav className="fixed w-screen top-0 p-2 z-40 flex justify-between items-center bg-light dark:bg-dark shadow-md transition-colors duration-500">
        <a href="#">
          <img src={logoSrc} className="w-11 fill-current text-green-600 duration-700" alt="Logo" />
        </a>
        <ul className="hidden dark:text-white duration-700 lg:flex md:space-x-8 md:items-center flex-grow justify-center">
          <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200">
            <a href="#projects">Projects</a>
          </li>
          <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200">
            <a href="#achievements">Achievements</a>
          </li>
          <li className="text-lg hover:cursor-pointer hover:scale-105 duration-200">
            <a href="#contact">Contact</a>
          </li>
          {/* Regular search bar for larger screens */}
          <li className=" max-lg:hidden w-[400px] relative text-lg">
            <input
              type="text"
              placeholder="Search Projects ... "
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="focus:border-yellow-500 border-[1px] bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md font-mono tracking-tighter w-[100%]  focus:outline-none transition-colors duration-200"
            />
            {isFocused && searchQuery && (
              <FaTimes
                className="absolute top-1/2 right-3 max-lg:hidden transform -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={clearSearch}
              />
            )}
            {!isFocused && !searchQuery && (
              <FaSearch className="absolute top-1/2 right-3 max-lg:hidden transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            )}
            {/* Display project list if there are search results */}
            {(isFocused || searchQuery) && filteredProjects.length > 0 && (
              <div className="absolute z-40 bg-white/10 backdrop-blur-md dark:bg-black/10 p-4 w-full rounded-sm shadow-lg border border-gray-300 dark:border-gray-700">
                <ul>
                  {filteredProjects.map((project) => (
                    <li key={project.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center">
                      <img
                        src={project.image.includes('http') ? project.image : `./images/${project.image}.jpg`}
                        alt={project.name}
                        className="w-12 h-12 rounded mr-3"
                      />
                      <div>
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">
                          {project.name}
                        </a>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>

        {/* Search icon for smaller screens */}
        <button className="lg:hidden  fixed top-4 right-12 max-lg:right-36 z-40 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" onClick={openSearchModal} ><FaSearch
          className="    text-dark-800 dark:text-white cursor-pointer"
          
        /></button>
      </nav>

      {/* Search Modal for smaller screens */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-start pt-10">
          <div className="w-[90%] max-w-lg bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search Projects ..."
                value={searchQuery}
                onChange={handleSearch}
                className="focus:border-yellow-500 border-[1px] bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md font-mono tracking-tighter w-full focus:outline-none transition-colors duration-200"
              />
              <FaTimes className=" m-2 text-gray-500 dark:text-white cursor-pointer" onClick={closeSearchModal} />
            </div>
            {filteredProjects.length > 0 ? (
              <ul>
                {filteredProjects.map((project) => (
                  <li key={project.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center">
                    <img
                      src={project.image.includes('http') ? project.image : `./images/${project.image}.jpg`}
                      alt={project.name}
                      className="w-12 h-12 rounded mr-3"
                    />
                    <div>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">
                        {project.name}
                      </a>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No projects found</p>
            )}
          </div>
        </div>
      )}

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
