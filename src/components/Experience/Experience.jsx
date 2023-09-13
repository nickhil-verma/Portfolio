import React, { useContext } from "react";
import { themeContext } from "../../Context";
import "./Experience.css";
const Experience = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
  <div className="acaddiv"><span className="acad">Academic Timeline:-</span>  
    <div className="experience" id='experience'>
      
      <div className="achievement">
        {/* darkMode */}
        
        <div className="circle" style={{color: darkMode?'var(--orange)':''}}>2020</div>
        <span  style={{color: darkMode?'white':''}}>CBSE </span>
        <span>Matriculation</span>
      </div>
      <div className="achievement">
        <div className="circle" style={{color: darkMode?'var(--orange)':''}}>2022</div>
        <span  style={{color: darkMode?'white':''}}>CBSE</span>
        <span>Intermediate</span>
      </div>
      <div className="achievement">
        <div className="circle" style={{color: darkMode?'var(--orange)':''}}>2027</div>
        <span  style={{color: darkMode?'white':''}}>B.Tech</span>
        <span>ECE</span>
      </div>
    </div>
  </div>
  );
};

export default Experience;
