import React, { useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';
import CustomButton from './CustomButton';
import PROJ1 from "../img/proj1.png";
import { FaYoutube } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import PROJ2 from '../img/proj2.png';
import PROJ3 from '../img/thumbnailfooter.png';
import AIPROJ1 from "../img/AIPROJ1.jpg"

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [activeTab, setActiveTab] = useState('web'); 

  const bounceVariants = {
    animate: {
      y: [0, -10, 0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  // Projects for web development
  const webProjects = [
    {
      id: 1,
      title: "GenCV | AI resume Builder",
      description: "Gen CV is an online resume builder platform targeting enhancement of ATS score using Google Gemini API",
      image: PROJ1,
      github: "https://github.com/project-one",
      link: "https://gen-cv-ai-resumebuilder-frontend.vercel.app/login",
    },
    {
      id: 2,
      title: "TradeWage | Stock management APP",
      description: "Built a MERN stack app for real-time stock trading, with React.js, Mongoose, Axios, Chart.js, and secure authentication.",
      image: PROJ2,
      github: "https://github.com/nickhil-verma/Trade-wage-frontend",
      link: "https://trade-wage-frontend.vercel.app/",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "A work showcasing website made using ReactJs, Tailwind, EmailJs",
      image: PROJ3,
      github: "https://github.com/nickhil-verma/Portfolio",
      link: "https://portfolio-eight-xi-99.vercel.app/",
    },
    {
      id: 4,
      title: "Project Four",
      description: "A short description of Project Four.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-four",
    },
    {
      id: 5,
      title: "Project Five",
      description: "A short description of Project Five.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-five",
    },
    {
      id: 6,
      title: "Project Six",
      description: "A short description of Project Six.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/project-six",
    }
  ];

  // Projects for AI/ML
  const aiProjects = [
    {
      id: 7,
      title: "Sign Language to Text and Voice in real time",
      description: "Enables hard heard community to interact. Compatible across all devices -(SIH Theme)",
      image: AIPROJ1,
      github: "https://github.com/ai-project-one",
    },
    {
      id: 8,
      title: "AI Project Two",
      description: "A description for AI project two.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/ai-project-two",
    },
    {
      id: 9,
      title: "AI Project Three",
      description: "A description for AI project three.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/ai-project-three",
    },
    {
      id: 10,
      title: "AI Project Four",
      description: "A description for AI project four.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/ai-project-four",
    },
    {
      id: 11,
      title: "AI Project Five",
      description: "A description for AI project five.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/ai-project-five",
    },
    {
      id: 12,
      title: "AI Project Six",
      description: "A description for AI project six.",
      image: "https://via.placeholder.com/600x400",
      github: "https://github.com/ai-project-six",
    }
  ];

  // Filter projects based on the active tab
  const projects = activeTab === 'web' ? webProjects : aiProjects;

  const showMoreProjects = () => {
    setVisibleProjects(visibleProjects + 3);
  };

  const showLessProjects = () => {
    setVisibleProjects(3);
    // Smooth scroll to the top of the projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto py-8 overflow-hidden" id='projects'>
      {/* Bouncing effect */}
      <motion.div
        initial={{ y: '0', x: '0', opacity: 0.5 }}
        animate={{ y: ['300px', '0px', '300px'], opacity: 0.7, backgroundColor: '#1A89E2' }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{ width: "300px", height: "300px" }}
        className="overflow-hidden blur-3xl absolute opacity-55 left-0 rounded-full bg-yellow z-0"
      />

      <h2 className="text-4xl max-sm:text-s font-bold z-10 text-center mb-8 dark:text-white">Projects</h2>

      {/* Tab buttons */}
      <div className="text-center   z-30 mb-4">
        <div className='backdrop-blur-sm  bg-white/30 rounded-md m-auto p-0 inline-block py-2 '>
          <button
            onClick={() => {
              setActiveTab('web');
              setVisibleProjects(3);
            }}
            className={`px-4 py-2 duration-500  mx-2 rounded ${activeTab === 'web' ? 'bg-yellow text-white' : 'bg-gray-200 text-black'}`}
          >
            Web-Dev Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('ai');
              setVisibleProjects(3);
            }}
            className={`px-4 py-2 mx-2 duration-700 rounded ${activeTab === 'ai' ? 'bg-yellow text-white' : 'bg-gray-200 text-black'}`}
          >
            AI/ML Projects
          </button>
        </div>
      </div>

      {/* Projects grid */}
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
              className="bg-white  z-20  dark:bg-lessdark p-6 rounded-lg flex flex-col duration-700 items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={project.image} alt={project.title} className="shadow-sm rounded-md mb-4 w-full" />
              <h3 className="text-2xl font-semibold mb-2 dark:text-white max-sm:text-xs text-center duration-700">
                {project.title}
              </h3>
              <p className="text-gray-500 text-sm max-sm:text-xs dark:text-gray-300 mb-4 text-center duration-700">
                {project.description}
              </p>
              <div className='flex text-center justify-center space-x-9'>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="dark:text-white hover:scale-105 duration-200">
                  <FaGithub className="text-2xl" />
                </a>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:scale-105  text-bluish duration-200">
                    <FaExternalLinkAlt className="text-2xl" />
                  </a>
                )}
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:scale-105 text-red-500 duration-200">
                  <FaYoutube className="text-2xl" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Expand/Collapse button */}
      <div className="text-center mt-8 duration-700">
        {visibleProjects < projects.length ? (
          <a onClick={showMoreProjects} className="inline-block">
            <motion.div variants={bounceVariants} animate="animate">
              <CustomButton text="EXPAND" />
            </motion.div>
          </a>
        ) : (
          <a onClick={showLessProjects} className="inline-block">
            <CustomButton text="COLLAPSE" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Projects;
