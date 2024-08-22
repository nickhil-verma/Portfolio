import React from 'react';
import { motion } from 'framer-motion';
// Education Component
const Education = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {educationData.map((item, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <motion.svg
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}

                className="w-3 h-3 text-blue-800 dark:text-blue-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </motion.svg>
            </span>
            <motion.h3 initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            viewport={{ once: true }}
             className="flex  max-sm:text-xs items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {item.title}
              {item.latest && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  Latest
                </span>
              )}
            </motion.h3>
            <time className="block mb-2 text-sm max-sm:text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
              {item.date}
            </time>
            <motion.p
             initial={{  opacity: 0 }}
             whileInView={{   opacity: 1 }}
             transition={{ delay: 0.6, duration: 1 }}
             viewport={{ once: true }}
             className="text-base max-sm:text-sm font-normal text-gray-500 dark:text-gray-400">
               {item.description}
            
              {item.description}
            </motion.p>
            {item.link && (
              <a
                href={item.link}
                className="inline-flex max-sm:text-sm   items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                <svg
                  className="w-3.5 h-3.5 mr-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                  <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                </svg>
                Download ZIP
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

// Experience Component
const Experience = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {experienceData.map((item, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
              <motion.svg
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
                className="w-3 h-3 text-green-800 dark:text-green-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </motion.svg>
            </span>
            <motion.h3 
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-1 text-lg max-sm:text-sm font-semibold text-gray-900 dark:text-white">
              {item.title}
            </motion.h3>
            <time className="block mb-2 text-sm max-sm:text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
              {item.date}
            </time>
            <motion.p
            initial={{  opacity: 0 }}
            whileInView={{   opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            viewport={{ once: true }}
            className="text-base font-normal text-gray-500 dark:text-gray-400">
              {item.description}
            </motion.p>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Main Component with Tabs
const TimelineTabs = () => {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (index) => {
    setTab(index);
  };

  return (
    <div className="relative w-full max-md:mt-5 max-w-3xl mx-auto p-6">
      <div className="absolute inset-0 -z-10">
        <div className="blurred-divbox w-full h-full bg-yellow blur-3xl opacity-15"></div>
      </div>
      <h1 className='dark:text-white max-sm:text-2xl text-5xl text-center font-semibold mt-10 mb-10'>Career Journey</h1>
      <div className="flex items-center justify-center mb-4 relative z-10">
        <button
          onClick={() => handleTabChange(0)}
          className={`px-4 py-2 rounded-t-lg ${tab === 0 ? 'bg-yellow text-white' : 'bg-gray-200'}`}
        >
          Education
        </button>
        <button
          onClick={() => handleTabChange(1)}
          className={`px-4 py-2 rounded-t-lg ${tab === 1 ? 'bg-yellow text-white' : 'bg-gray-200'}`}
        >
          Experience
        </button>
      </div>
      <div className="p-4 border  border-gray-200 rounded-b-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 relative z-10">
        {tab === 0 && <Education />}
        {tab === 1 && <Experience />}
      </div>
    </div>
  );
};

// Sample data for Education and Experience
const educationData = [
  {
    title: "Flowbite Application UI v2.0.0",
    date: "Released on January 13th, 2022",
    description:
      "Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.",
    link: "#",
    latest: true,
  },
  {
    title: "Flowbite Figma v1.3.0",
    date: "Released on December 7th, 2021",
    description:
      "All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.",
  },
  {
    title: "Flowbite Library v1.2.2",
    date: "Released on December 2nd, 2021",
    description:
      "Get started with dozens of web components and interactive elements built on top of Tailwind CSS.",
  },
];

const experienceData = [
  {
    title: "Front-end Developer at Company X",
    date: "June 2020 - Present",
    description:
      "Worked on various front-end projects using React and Tailwind CSS. Collaborated with designers and back-end developers to create seamless user experiences.",
  },
  {
    title: "Intern at Company Y",
    date: "January 2020 - May 2020",
    description:
      "Assisted with the development of internal tools and participated in team meetings to discuss project progress and improvements.",
  },
];

export default TimelineTabs;
