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
      {/* Add CSS for the frosted glass effect */}
      <style>
        {`
          .image-container {
            position: relative; /* Ensure the frosted glass overlay can be positioned */
          }

          .slide-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .frosted-glass {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: linear-gradient(
              to bottom,
              transparent 30%, /* Clear at the top */
              rgba(255, 255, 255, 0.1) 50%, /* Start of misty transition */
              rgba(255, 255, 255, 0.3) 70%, /* More frosted */
              rgba(255, 255, 255, 0.5) 100% /* Fully frosted at the bottom */
            );
            backdrop-filter: blur(12px); /* Slightly more frosted to match the reference */
            -webkit-backdrop-filter: blur(12px);
          }

          .text-container {
            z-index: 2; /* Ensure text is above the frosted glass */
            color: ${textColor}; /* Dynamic text color */
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
            {/* Image container */}
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
              {/* Frosted glass overlay */}
              <div className="frosted-glass" />
            </div>
            
            {/* Text container */}
            <div className="text-container">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
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