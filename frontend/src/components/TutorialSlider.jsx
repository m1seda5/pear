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
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const autoSlideIntervalRef = useRef(null);
  
  const slides = [
    {
      title: "Events",
      image: "/dist/concert.png", // Changed from /concert.jpg to match your file structure
      description: "Get to know when that next lunchtime concert is, when the next big tournament is, and then yeah."
    },
    {
      title: "Sports",
      image: "/dist/sports.png", // Changed from /sports.jpg to match your file structure
      description: "Keep track of scores, catch a glimpse, and don't miss out on the school action."
    },
    {
      title: "Notices",
      image: "/dist/notices.png", // Changed from /notices.jpg to match your file structure
      description: "Transform boring and mundane to quick-fire updates that keep you informed."
    },
    {
      title: "Clubs and Communities",
      image: "/dist/environmentclub.png", // Changed from /environmentclub.jpg to match your file structure
      description: "All Brookhouse stories documented in one place."
    }
  ];
  // Determine text color based on the current slide's image
  useEffect(() => {
    getTextColorBasedOnImage(slides[currentIndex].image, (color) => {
      setTextColor(color);
    });
  }, [currentIndex]);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Calculate size based on screen dimensions
  const isMobile = screenSize.width < 768;
  const cardWidth = isMobile ? Math.min(320, screenSize.width * 0.85) : Math.min(380, screenSize.width * 0.8);
  const cardHeight = isMobile ? Math.min(480, screenSize.height * 0.7) : Math.min(550, screenSize.height * 0.7);
  const offsetMultiplier = isMobile ? 0.4 : 0.55; // Less offset on mobile

  return (
    <>
      {/* Add CSS for the card style matching the reference images */}
      <style>
        {`
          /* Slider container styling - responsive */
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
          
          /* Individual slide styling - responsive sizing */
          .slide {
            position: absolute;
            width: ${cardWidth}px;
            height: ${cardHeight}px;
            border-radius: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.5s ease, opacity 0.5s ease;
            cursor: pointer;
          }
          
          /* Positions for the deck effect - adjusted for responsive sizing */
          .slide.left {
            transform: translateX(-${cardWidth * offsetMultiplier}px) rotateY(30deg) scale(0.9);
            opacity: 0.7;
            z-index: 1;
          }
          
          .slide.center {
            transform: translateX(0) rotateY(0deg) scale(1);
            opacity: 1;
            z-index: 2;
          }
          
          .slide.right {
            transform: translateX(${cardWidth * offsetMultiplier}px) rotateY(-30deg) scale(0.9);
            opacity: 0.7;
            z-index: 1;
          }
          
          .slide.hidden {
            transform: translateX(${cardWidth * 1.1}px) rotateY(-30deg) scale(0.9);
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
          
          /* Gradient blur effect with smoother transition similar to reference images */
          .text-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 65%; /* Extended height for smoother gradient */
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.1) 15%,
              rgba(0, 0, 0, 0.2) 30%,
              rgba(0, 0, 0, 0.4) 45%,
              rgba(0, 0, 0, 0.6) 70%,
              rgba(0, 0, 0, 0.7) 90%
            );
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: ${isMobile ? '20px 16px' : '30px 20px'};
            color: ${textColor}; /* Dynamic text color */
            z-index: 2;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          /* Text styling with responsive font sizes */
          .text-overlay h2 {
            font-size: ${isMobile ? '26px' : '32px'};
            margin: 0 0 ${isMobile ? '6px' : '10px'} 0;
            font-weight: 600;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }
          
          .text-overlay p {
            font-size: ${isMobile ? '14px' : '16px'};
            margin: 0;
            opacity: 0.9;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
          
          /* Status pill at top (like "Going" or "Hosting" in reference) */
          .status-pill {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: ${isMobile ? '6px 12px' : '8px 16px'};
            border-radius: 20px;
            font-size: ${isMobile ? '12px' : '14px'};
            z-index: 3;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          /* Done button styling - responsive */
          .done-button {
            position: absolute;
            bottom: ${isMobile ? '16px' : '20px'};
            right: ${isMobile ? '16px' : '20px'};
            padding: ${isMobile ? '10px 20px' : '12px 24px'};
            background: #38A169;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1003;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            font-weight: 600;
            font-size: ${isMobile ? '14px' : '16px'};
          }
          
          .done-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          
          /* Close button styling - responsive */
          .close-button {
            position: absolute;
            top: ${isMobile ? '16px' : '20px'};
            right: ${isMobile ? '16px' : '20px'};
            width: ${isMobile ? '32px' : '36px'};
            height: ${isMobile ? '32px' : '36px'};
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

          /* Animation for blur effect */
          @keyframes blurIn {
            from {
              backdrop-filter: blur(0);
              background-color: rgba(0, 0, 0, 0);
            }
            to {
              backdrop-filter: blur(8px);
              background-color: rgba(0, 0, 0, 0.4);
            }
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
              
              {/* Text overlay with smoother gradient blur effect */}
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