import React, { useContext, useRef, useState } from "react";
import "./Contact.css";
import emailjs from "@emailjs/browser";
import { themeContext } from "../../Context";
const Contact = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const form = useRef();
  const [done, setDone] = useState(false)
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_xxomne7",
        "template_l39w8wi",
        form.current,
        "i6Aaq5I0OEyQLqAPi"
      )
      .then(
        (result) => {
          console.log(result.text);
          setDone(true);
          form.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  const[phoneNumber,setPhoneNumber]=useState('');
  const[valid,setValid]= useState(true);

  const handleChange = (event)=>{
    const input = event.target.value;
    setPhoneNumber(input);
    setValid(validatePhoneNumber(input));

  };

  const validatePhoneNumber = (phoneNumber) =>{
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(phoneNumber);
  }


  return (
    
    
    <div className="contact-form" id="contact">
      {/* left side copy and paste from work section */}
      <div className="w-left">
        <div className="awesome">
          {/* darkMode */}
          <span style={{color: darkMode?'white': ''}}>Let's have</span>
          <span>Coffee this weekend</span>
          <div
            className="blur s-blur1"
            style={{ background: "#ABF1FF94" }}
          ></div>
        </div>
      </div>
      {/* right side form */}
      <div className="c-right">
        <form ref={form} onSubmit={sendEmail}>
          <input type="text" name="user_name" className="user"  placeholder="Name" required />
          <input type="email" name="user_email" className="user" placeholder="Email" required />
          <input type="text" value={phoneNumber} onChange={handleChange} name="mobno" className="user" placeholder="Phone No." required />
          {!valid && <p>Please enter 10 digit valid number</p>}
          <textarea name="message" className="user" placeholder="Message"/>
          
          <input type="submit" value="Send" className="button"/>
          <span>{done && "Thanks for Contacting me & do check Your email"}</span>
          <div
            className="blur c-blur1"
            style={{ background: "var(--purple)" }}
          ></div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
