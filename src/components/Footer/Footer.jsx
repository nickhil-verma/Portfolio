import React from "react";
import "./Footer.css";
import Wave from "../../img/wave.png";
import Insta from "@iconscout/react-unicons/icons/uil-instagram";
import Spotify from "@iconscout/react-unicons/icons/uil-twitter";
import Gitub from "@iconscout/react-unicons/icons/uil-github";


const Footer = () => {
  return (
    <div className="footer">
      <img src={Wave} alt="" style={{ width: "100%" }} />
      <div className="f-content">
      
        <span className="footertxt">&nbsp; &nbsp; All rights reserved @Nikhil_verma 2023<br></br>vermanick75@gmail.com | Nickhil_Verma</span>
        <div className="f-icons">
          <a href="https://www.instagram.com/nickhil_verma/"><Insta color="white" size={"3rem"} /></a>
          <a href="https://www.google.com"><Spotify color="white" size={"3rem"} /></a>
          <a href="https://github.com/nickhil-verma" ><Gitub color="white" size={"3rem"} /></a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
