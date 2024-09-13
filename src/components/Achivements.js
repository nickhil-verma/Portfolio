import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CF from "../img/CF_Handle.png";

const Achievements = () => {
  const [codeforcesRating, setCodeforcesRating] = useState(null);

  useEffect(() => {
    // Fetch Codeforces rating
    const fetchCodeforcesRating = async () => {
      try {
        const response = await fetch('https://codeforces.com/api/user.rating?handle=nickhilverma');
        const data = await response.json();
        if (data.status === 'OK') {
          const recentContest = data.result[data.result.length - 1]; // Get the most recent contest
          setCodeforcesRating(recentContest.newRating); // Set the new rating
        }
      } catch (error) {
        console.error("Error fetching Codeforces rating:", error);
      }
    };

    fetchCodeforcesRating();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const items = [
    {
      title: "CP Career",
      description: codeforcesRating
      ? `Current Codeforces Rating: ${codeforcesRating}`
      : "Loading Codeforces rating...",
      img: CF, // Replace with actual image URLs
    },
    {
      title: "Active users gained on GenCV",//
      description: "Achieved 100+ users on GenCV webpage",
      img: "https://via.placeholder.com/150", // Replace with actual image URLs
    },
  ];

  return (
    <div id="achievements" className="container mx-auto p-8 bg-light dark:bg-dark transition-colors duration-700">
      <h1 className="text-gray-800 duration-700 max-sm:text-s dark:text-gray-200 text-3xl font-bold text-center mb-8">
        Achievements
      </h1>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="p-4 duration-700">
            <div
              className="bg-white dark:bg-lessdark px-3 py-3 rounded-lg shadow-lg overflow-hidden transition-colors duration-700"
              style={{
                width: "100%",
                maxWidth: "100%",
                "@media (min-width: 768px)": {
                  maxWidth: "70%", // 70% width for medium devices
                },
                "@media (min-width: 640px)": {
                  maxWidth: "90%", // 90% width for small devices
                },
              }}
            >
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg dark:text-white font-semibold mb-2 duration-700">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 duration-700">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Achievements;
