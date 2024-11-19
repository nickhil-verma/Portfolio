import React from "react";
import { motion } from "framer-motion";
import HTML from "../img/html.png";
import DOCKER from "../img/docker.png";
import JS from "../img/js.png";
import NODE from "../img/node.png";
import REACT from "../img/react.png";
import GIT from "../img/git.png";
import CSS from "../img/css.png";
import C from "../img/c.png";
import CPP from "../img/c++.png";
import MONGODB from "../img/Mongodb.png";
import PHOTOSHOP from "../img/photoshop.png";
import MUI from "../img/materialui.png";
import BOOTSTRAP from "../img/Bootstrap.png";
import GITLAB from "../img/gitlab.png";
import OBS from "../img/obs.jpeg";
import AUDITION from "../img/audition.png";
import PREMEIRE from "../img/premeire.png";
import PYTHON from "../img/python.jpeg";
import VSCODE from "../img/vscode.png";

const Skills = () => {
  const skills = [
    { img: HTML, name: "HTML" },
    { img: CSS, name: "CSS" },
    { img: JS, name: "JavaScript" },
    { img: DOCKER, name: "Docker" },
    { img: NODE, name: "Node.js" },
    { img: GIT, name: "Git" },
    { img: REACT, name: "ReactJS" },
    { img: PREMEIRE, name: "ADPP" },
    { img: PHOTOSHOP, name: "Photoshop" },
    { img: MUI, name: "Material UI" },
    { img: C, name: "C" },
    { img: BOOTSTRAP, name: "Bootstrap" },
    { img: GITLAB, name: "Gitlab" },
    { img: OBS, name: "OBS" },
    { img: AUDITION, name: "Adobe Audition" },
    { img: PYTHON, name: "Python" },
    { img: VSCODE, name: "VS Code" },
    { img: CPP, name: "C++" },
    { img: MONGODB, name: "MongoDB" },
  ];

  return (
    <div className="bg-light dark:bg-dark text-gray-800 dark:text-gray-200 p-8 duration-700" id="skills">
      <h1 className="text-3xl max-sm:text-s z-10 font-bold text-center mb-8">Skills</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
        To be noted, this was last updated in Dec 2023
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center bg-white dark:bg-lessdark duration-700 p-4 rounded-lg shadow-lg w-full max-w-[150px] h-[150px] justify-center">
              <img src={skill.img} alt={skill.name} className="w-12 h-12 md:w-16 md:h-16 mb-4" />
              <h3 className="text-sm md:text-lg font-semibold">{skill.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
