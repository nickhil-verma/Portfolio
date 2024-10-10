import React from 'react';
import { motion } from 'framer-motion';
import { BsStars } from "react-icons/bs";
// Education Component
const Education = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <ol className="relative  border-l border-gray-200 dark:border-gray-700">
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
                <span className="bg-blue-100 flex items-center text-blue-800 text-sm font-medium ml-3 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  Latest &nbsp; <BsStars />
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
               Resume
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
    <div className="w-full max-w-3xl     border-3 dmx-auto p-6">
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
    <div className="relative w-full  rounded-lg max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ y: '0', x: '0', opacity: 0.5,backgroundColor: '#FFC727' }}
        animate={{ y: ['300px', '0px', '300px'], x: ['30px', '0px', '30px'],opacity: 0.3, backgroundColor: '#1A89E2' }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      className='w-[99%] h-[250px] left-0  top-40 bg-yellow blur-3xl   duration-1000 absolute z-0'></motion.div>
      <div className="absolute inset-0 -z-10">
        
      </div>
      <h1 className='dark:text-white max-sm:text-2xl text-5xl text-center font-semibold mt-10 z-10 mb-10'>Career Journey</h1>
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
    title: "B.Tech",
    date: "2023-2027",
    description:
      "CGPA - 8.5  Dayananda sagar college of Engineeing  Bengaluru",
    link: "https://docs.google.com/document/d/1QjrcRxxFIcbXDU_ig183W7Jeud_3yybY3aeWLlu2x5I/edit",
    latest: true,
  },
  {
    title: "Intermediate",
    date: "2020-2022",
    description:
      "Chinmaya Vidyalaya Bokaro steel city , Jharkhand",
  },
  {
    title: "Matriculation",
    date: "2019-2020",
    description:
      "94% , Sacred Heart School , Jharkhand",
  },
];

const experienceData = [
  {
    title: "WEB MASTER @ IEEE CEDA",
    date: "SEPT 2024 - Present",
    description:
      "Worked on micro services. Integrated Admin panel with Secured Backend API'S Grabbed 500+ Active subscribers and engineered a broadcasting Panel for admins for direct integration of CEDA society with their Subscribers ",
  },
  {
    title: "Intern at Company Y",
    date: "January 2020 - May 2020",
    description:
      "Assisted with the development of internal tools and participated in team meetings to discuss project progress and improvements.",
  },
];

export default TimelineTabs;
