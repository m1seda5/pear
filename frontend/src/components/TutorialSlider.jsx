import { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';

// Utility function to determine if the image is light or dark
const getTextColorBasedOnImage = (imgSrc, callback) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgSrc;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
      count++;
    }
    const avgR = r / count;
    const avgG = g / count;
    const avgB = b / count;
    const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000; // Luminance formula
    callback(brightness > 128 ? "black" : "white");
  };
  img.onerror = () => callback("white"); // Fallback to white if image fails to load
};

const TutorialSlider = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [textColor, setTextColor] = useState("white"); // Default to white
  const autoSlideIntervalRef = useRef(null);
  
  // Tutorial content with updated image paths
  // Now using root-level paths like verified.png
  const slides = [
    {
      title: "Events",
      image: "/concert.jpg",
      description: "Get to know when that next lunchtime concert is, when the next big tournament is, and then yeah."
    },
    {
      title: "Sports",
      image: "/sports.jpg",
      description: "Keep track of scores, catch a glimpse, and don't miss out on the school action."
    },
    {
      title: "Notices",
      image: "/notices.jpg",
      description: "Transform boring and mundane to quick-fire updates that keep you informed."
    },
    {
      title: "Clubs and Communities",
      image: "/environmentclub.jpg",
      description: "All Brookhouse stories documented in one place."
    }
  ];

  // Determine text color based on the current slide's image
  useEffect(() => {
    getTextColorBasedOnImage(slides[currentIndex].image, (color) => {
      setTextColor(color);
    });
  }, [currentIndex]);

  // Reset auto-slide timer when current slide changes
  useEffect(() => {
    clearInterval(autoSlideIntervalRef.current);
    
    // Auto-slide after 3 seconds
    autoSlideIntervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 3000);
    
    return () => clearInterval(autoSlideIntervalRef.current);
  }, [currentIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearInterval(autoSlideIntervalRef.current);
  }, []);

  // Function to go to the next slide
  const goToNextSlide = () => {
    if (currentIndex >= slides.length - 1) {
      // If we've reached the end, close the tutorial
      handleComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Function to go to the previous slide
  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle completion of tutorial
  const handleComplete = () => {
    setIsVisible(false);
    // Small delay before calling onComplete to allow for exit animations
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };

  // If not visible, don't render anything
  if (!isVisible) return null;

  // Determine slide positions
  const getSlidePosition = (index) => {
    if (index === currentIndex) return "center";
    if (index === currentIndex - 1) return "left";
    if (index === currentIndex + 1) return "right";
    return "hidden";
  };

  return (
    <>
      {/* Add CSS for the card style matching the reference images */}
      <style>
        {`
          /* Slider container styling - slightly increased card spacing */
          .slider-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1002;
            perspective: 1000px;
          }
          
          /* Blur background when slider is active */
          .blur-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(8px);
            background: rgba(0, 0, 0, 0.4);
            z-index: 1001;
            animation: blurIn 0.5s forwards;
          }
          
          /* Individual slide styling - slightly wider and taller */
          .slide {
            position: absolute;
            width: 380px; /* Slightly wider than the original 350px */
            height: 550px; /* Slightly taller than the original 500px */
            border-radius: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.5s ease, opacity 0.5s ease;
            cursor: pointer;
          }
          
          /* Positions for the deck effect - adjusted for new card dimensions */
          .slide.left {
            transform: translateX(-55%) rotateY(30deg) scale(0.9);
            opacity: 0.7;
            z-index: 1;
          }
          
          .slide.center {
            transform: translateX(0) rotateY(0deg) scale(1);
            opacity: 1;
            z-index: 2;
          }
          
          .slide.right {
            transform: translateX(55%) rotateY(-30deg) scale(0.9);
            opacity: 0.7;
            z-index: 1;
          }
          
          .slide.hidden {
            transform: translateX(110%) rotateY(-30deg) scale(0.9);
            opacity: 0;
            z-index: 0;
          }
          
          /* Hover effect for centered slide */
          .slide.center:hover {
            transform: translateX(0) rotateY(0deg) scale(1.03);
          }
          
          /* Full image card style */
          .image-container {
            position: relative;
            width: 100%;
            height: 100%; /* Full height of the card */
            overflow: hidden;
            border-radius: 20px;
          }
          
          .slide-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          
          /* Gradient blur effect similar to reference images */
          .text-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 55%; /* Covers bottom half of card */
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.2) 20%,
              rgba(0, 0, 0, 0.5) 50%,
              rgba(0, 0, 0, 0.7) 100%
            );
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 30px 20px;
            color: ${textColor}; /* Dynamic text color */
            z-index: 2;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          /* Text styling */
          .text-overlay h2 {
            font-size: 32px;
            margin: 0 0 10px 0;
            font-weight: 600;
          }
          
          .text-overlay p {
            font-size: 16px;
            margin: 0;
            opacity: 0.9;
          }
          
          /* Status pill at top (like "Going" or "Hosting" in reference) */
          .status-pill {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 3;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          /* Done button styling */
          .done-button {
            position: absolute;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #38A169;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1003;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            font-weight: 600;
            font-size: 16px;
          }
          
          .done-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          
          /* Close button styling */
          .close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1003;
            transition: transform 0.2s ease;
          }
          
          .close-button:hover {
            transform: rotate(90deg);
          }
        `}
      </style>

      {/* Blur background overlay */}
      <div className="blur-background" />
      
      {/* Slider container */}
      <div className="slider-container">
        {/* Close button */}
        <button className="close-button" onClick={handleComplete}>
          <Icon as={CloseIcon} />
        </button>
        
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${getSlidePosition(index)}`}
            onClick={() => {
              const position = getSlidePosition(index);
              if (position === "center") goToNextSlide();
              else if (position === "left") goToPreviousSlide();
            }}
          >
            {/* Full image container */}
            <div className="image-container">
              <img
                className="slide-image"
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  console.error(`Failed to load image: ${slide.image}`);
                  e.target.src = "/pear.png"; // Optional fallback
                }}
              />
              
              {/* Status indicator pill (similar to "Going" or "Hosting" in reference) */}
              {index === currentIndex && (
                <div className="status-pill">
                  <span>New</span>
                </div>
              )}
              
              {/* Text overlay with gradient blur effect */}
              <div className="text-overlay">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Done button */}
        <button className="done-button" onClick={handleComplete}>
          Done
        </button>
      </div>
    </>
  );
};

export default TutorialSlider;