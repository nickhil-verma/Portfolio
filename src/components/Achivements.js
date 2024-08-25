import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CF from "../img/CF_Handle.png"
const Achievements = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,  // Show 2 slides in a row by default
    slidesToScroll: 1,
    cssEase: "ease-in-out",  // Smoothen the transition
    responsive: [
      {
        breakpoint: 1024, // Large devices
        settings: {
          slidesToShow: 2,  // Adjust to show 2 slides for large screens
        },
      },
      {
        breakpoint: 768, // Medium devices
        settings: {
          slidesToShow: 2,  // Adjust to show 2 slides for medium screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // Small devices
        settings: {
          slidesToShow: 1,  // Show only 1 slide for small screens
        },
      },
    ],
  };

  const items = [
    {
      title: "Achievement 1",
      description: "Achived 100+ user on GenCV webpage",
      img: CF, // Replace with actual image URLs
    },
    {
      title: "Achievement 2",
      description: "This is a short description for Achievement 2.",
      img: "https://via.placeholder.com/150",
    },
    
  ];

  return (
    <div id='achievements' className="container mx-auto p-8 bg-light dark:bg-dark transition-colors duration-700">
      <h1 className="text-gray-800 duration-700 max-sm:text-s dark:text-gray-200 text-3xl font-bold text-center mb-8">Achievements</h1>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="p-4 duration-700">
            <div
              className="bg-white dark:bg-lessdark px-3 py-3 rounded-lg shadow-lg overflow-hidden transition-colors duration-700"
              style={{
                width: '100%',
                maxWidth: '100%',
                '@media (min-width: 768px)': {
                  maxWidth: '70%', // 70% width for medium devices
                },
                '@media (min-width: 640px)': {
                  maxWidth: '90%', // 90% width for small devices
                },
              }}
            >
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg dark:text-white font-semibold mb-2duration-700">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400duration-700">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Achievements;
