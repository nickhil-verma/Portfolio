 
import './App.css';
import Achivements from './components/Achivements';
import Contact from './components/Contact';
import Education from './components/Education';
import Footer from './components/Footer';
import Hero from './components/Hero';
import LoadingPage from './components/LoadingPage';
import Navbar from './components/navbar/Navbar';
import Projects from './components/Projects';
 import Skills from './components/Skills';
 import React, { useState } from 'react';
 import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  return (
     <div className=' bg-light dark:bg-dark overflow-hidden duration-700'>
    <LoadingPage/>
     <Navbar/>
      <Hero/>
      <Education/>
      <Projects/>
      <Skills/>
      <Achivements/>
      <Contact/>
      <Footer/>
     
     </div>
  );
}

export default App;
