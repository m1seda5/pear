import { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';

const TutorialSlider = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
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