import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CF from "../img/CF_Handle.png";
import SIH from "../img/SIH.png"
import AVINYA from "../img/Avinya.png"

const Achievements = () => {
  const [codeforcesData, setCodeforcesData] = useState({
    rating: null,
    maxRating: null,
    problemsSolved: null,
  });

  useEffect(() => {
    const fetchCodeforcesData = async () => {
      try {
        // Fetch user rating history
        const ratingResponse = await fetch('https://codeforces.com/api/user.rating?handle=nickhilverma');
        const ratingData = await ratingResponse.json();

        let recentRating = null;
        let maxRating = null;

        if (ratingData.status === 'OK' && ratingData.result.length > 0) {
          const recentContest = ratingData.result[ratingData.result.length - 1]; // Get the most recent contest
          recentRating = recentContest.newRating; // Set the new rating
          maxRating = Math.max(...ratingData.result.map(contest => contest.newRating)); // Find the max rating
        }

        // Fetch user info (problems solved)
        const userInfoResponse = await fetch('https://codeforces.com/api/user.info?handles=nickhilverma');
        const userInfoData = await userInfoResponse.json();

        let problemsSolved = null;
        if (userInfoData.status === 'OK' && userInfoData.result.length > 0) {
          problemsSolved = userInfoData.result[0].maxSolvedProblems; // Assuming the data has solved problem count, otherwise adjust
        }

        // Set both ratings and problems solved to state
        setCodeforcesData({
          rating: recentRating,
          maxRating: maxRating,
          problemsSolved: problemsSolved,
        });
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
      }
    };

    fetchCodeforcesData();
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
      title: "Smart India Hackathon - 2024 Finalist",//
      description: "Leader of Team ZEPHYR1 shortlisted for SIH Grand Finale (PS ID 1719) for developing a 'Smart Monitoring System for Classrooms' project.",
      img: SIH, // Replace with actual image URLs
    },
    {
      title: "2nd Prize - National Intercollegiate Hackathon (IEEE Bangalore)",
      description:" Secured 2nd place in AVINYA-2K24, a national hackathon by SJICT & IEEE Bangalore. Developed a software-hardware device for optimal microgreens growth.",
      img: AVINYA, // Replace with actual image URLs
    },
    {
      title: "CP Career",
      description: codeforcesData.rating
        ? `Current Codeforces Rating: ${codeforcesData.rating}, Max Rating: ${codeforcesData.maxRating}, Problems Solved: ${codeforcesData.problemsSolved || 'Loading...'}`
        : "Loading Codeforces data...",
      img: CF, // Replace with actual image URLs
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
              <img src={item.img} alt={item.title} className="w-full h-48 object-fit" />
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
