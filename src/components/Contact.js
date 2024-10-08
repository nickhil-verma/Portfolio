import React, { useRef, useState } from 'react';
import { IoIosMail } from "react-icons/io";
import { FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import CustomButton from './CustomButton';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ContactUS from '../../src/img/Contactus.gif'

const Contact = () => {
    const form = useRef();
    const [done, setDone] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            "service_xxomne7",
            "template_h4sh03m",
            form.current,
            "i6Aaq5I0OEyQLqAPi"
        )
        .then((result) => {
            console.log('Email sent successfully:', result.text);
            form.current.reset();
            setDone(true);
            toast.success("Message sent successfully!"); 
            setTimeout(() => {
                toast.info("Check your email for confirmation."); 
            }, 1000);
        })
        .catch((error) => {
            console.error('Email not sent:', error);
            toast.error("Failed to send message. Please try again."); 
        });
    };

    const handleButtonClick = (e) => {
        e.preventDefault();

        const formElements = form.current.elements;
        let allFilled = true;

        for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].type !== 'submit' && !formElements[i].value.trim()) {
                allFilled = false;
                break;
            }
        }

        if (allFilled) {
            sendEmail(e); 
        } else {
            toast.error("Please fill out all required fields."); 
        }
    };

    return (
        <>
            <h1 className='text-center  max-sm:text-s text-4xl font-bold mb-8 dark:text-white'>Contact</h1>
            <div id="contact" className='  flex flex-col lg:flex-row justify-between items-start duration-700 bg-light dark:bg-dark p-8 rounded-lg'>
                <div className=' m-auto text-center lg:text-left mb-8 lg:mb-0 lg:w-1/3'>
                    <h3 className='text-2xl  max-sm:text-xs font-semibold dark:text-white'>
                        I have got just what you need.<br />
                        <span className='text-yellow'>Let's Talk!</span>
                    </h3>
                    
                    <div className='flex justify-center lg:justify-start mt-4'>
                        <a 
                            href="mailto:vermanick75@gmail.com?subject=Got your email from portfolio" 
                            className='text-black dark:text-white hover:scale-125 transition-transform duration-500 mx-2 hover:text-yellow'
                        >
                            <IoIosMail className='text-2xl' />
                        </a>
                        <a 
                            href="https://github.com/nickhil-verma" 
                            className='text-black dark:text-white hover:scale-125 transition-transform duration-500 mx-2 hover:text-yellow'
                        >
                            <FaGithub className='text-2xl' />
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/nikhil-verma-banglore" 
                            className='text-black dark:text-white hover:scale-125 transition-transform duration-500 mx-2 hover:text-yellow'
                        >
                            <FaLinkedin className='text-2xl' />
                        </a>
                        <a 
                            href="https://www.instagram.com/nickhil_verma/?igsh=MWljaDU2bW9kMmZ4dQ%3D%3D&utm_source=qr" 
                            className='text-black dark:text-white hover:scale-125 transition-transform duration-500 mx-2 hover:text-yellow'
                        >
                            <AiFillInstagram className='text-2xl' />
                        </a>
                        <a 
                            href="https://wa.me/9060177870?text=Hyy!%20Nikhil." 
                            className='text-black dark:text-white hover:scale-125 transition-transform duration-500 mx-2 hover:text-yellow'
                        >
                            <FaWhatsapp className='text-2xl' />
                        </a>
                    </div>
                    <img className='h-80 mix-blend-multiply' src={ContactUS} alt="Contact Us" />
                </div>
                <div className='w-full lg:w-1/2'>
                    <form ref={form} className='flex flex-col space-y-4'>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <motion.input
                                initial={{ x: -100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                viewport={{ once: true }}
                                required
                                className='flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg border-b-2 border-gray-400 focus:outline-none focus:border-yellow-500 text-black dark:text-white'
                                name="user_name"
                                type='text'
                                placeholder='Name'
                            />
                            <motion.input
                                initial={{ x: 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                viewport={{ once: true }}
                                required
                                className='flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg border-b-2 border-gray-400 focus:outline-none focus:border-yellow-500 text-black dark:text-white'
                                name="user_email"
                                type='email'
                                placeholder='Email@example.com'
                            />
                        </div>
                        <motion.input
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            viewport={{ once: true }}
                            className='bg-gray-200 dark:bg-gray-700 p-3 rounded-lg border-b-2 border-gray-400 focus:outline-none focus:border-yellow-500 text-black dark:text-white'
                            type='text'
                            name="mobno"
                            placeholder='Subject'
                        />
                        <motion.textarea
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            viewport={{ once: true }}
                            required
                            className='bg-gray-200 dark:bg-gray-700 p-3 rounded-lg border-b-2 border-gray-400 focus:outline-none focus:border-yellow-500 text-black dark:text-white'
                            name="message"
                            placeholder='Your Message'
                        ></motion.textarea>
                         <a type='submit' className=' p-0 inline-block' onClick={handleButtonClick}><CustomButton 
                           
                            text="Submit" 
                        /></a>
                        
                  
                    </form>
                </div>
            </div>
            <ToastContainer
            theme='colored'/>
            <hr className="border-gray-300 dark:border-gray-600" />

        </>
    );
};

export default Contact;
