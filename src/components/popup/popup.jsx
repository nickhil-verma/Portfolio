import React from 'react'
 import "./popup.css";
 import Meme from "../../img/meme.jpg"

function Popup(props){
  return (props.trigger)?(
    <div className='popup'>
        <div className='innerpopup'>
            <button className="close" onClick={()=>props.setTrigger(false)}> <h1 className="closetext">Close</h1></button>
            {props.children}
                  {/* My Popup
                  <p>Weclome to this page lo paani pee lo thak gaye hoge tum</p> */}
                  <img src={Meme} className="memeimg" />
        </div>
      
    </div>
  ): "";
}

export default Popup
