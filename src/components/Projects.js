import React, { useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';
import CustomButton from './CustomButton';
const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState(3);

  const projects = [
    {
      id: 1,
      title: "Project One",
      description: "A short description of Project One.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-one"
    },
    {
      id: 2,
      title: "Project Two",
      description: "A short description of Project Two.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-two"
    },
    {
      id: 3,
      title: "Project Three",
      description: "A short description of Project Three.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-three"
    },
    {
      id: 4,
      title: "Project Four",
      description: "A short description of Project Four.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-four"
    },
    {
      id: 5,
      title: "Project Five",
      description: "A short description of Project Five.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-five"
    },
    {
      id: 6,
      title: "Project Six",
      description: "A short description of Project Six.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-six"
    },
    // Add more projects as needed
  ];

  const showMoreProjects = () => {
    setVisibleProjects(visibleProjects + 3);
  };

  const showLessProjects = () => {
    setVisibleProjects(3);
  };

  return (
    <div className="container mx-auto py-8" id='projects'>
      <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">Projects</h2>
      
      <motion.div
        initial={{ height: 'auto' }}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="grid m-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, visibleProjects).map((project) => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-lessdark p-6 rounded-lg   flex flex-col duration-700 items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={project.image} alt={project.title} className="rounded-md mb-4 w-full" />
              <h3 className="text-2xl font-semibold mb-2 dark:text-white text-center duration-700">{project.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-center duration-700">{project.description}</p>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-yellow duration-700">
                <FaGithub className="text-2xl" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="text-center mt-8 duration-700">
        {visibleProjects < projects.length ? (
          // <button
          //   onClick={showMoreProjects}
          //  className='border dark:border-white dark:text-white hover:bg-yellow duration-700 border-black border-solid p-2.5 px-3 py-2 rounded-2xl m-2 shadow-md'
          // >
          //   Expand
          // </button>
          <a onClick={showMoreProjects}><CustomButton  text="EXPAND"></CustomButton></a>
        ) : (
          // <button
          //   onClick={showLessProjects}
          //   className='border dark:border-white dark:text-white hover:bg-yellow duration-700 border-black border-solid p-2.5 px-3 py-2 rounded-2xl m-2 shadow-md'>
          //   Collapse
          // </button>
          <a onClick={showLessProjects}><CustomButton  text="COLLAPSE"></CustomButton></a>
        )}
      </div>
    </div>
  );
};

export default Projects;
