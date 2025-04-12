import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// Import images
import concertImg from "../assets/images/concert.jpg";
import sportsImg from "../assets/images/sports.jpg";
import noticesImg from "../assets/images/notices.jpg";
import environmentclubImg from "../assets/images/environmentclub.jpg";
import pearImg from "../assets/images/pear.png";

const TutorialSlider = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [textColor, setTextColor] = useState("white"); // Default to white
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });
  const autoSlideIntervalRef = useRef(null);

  // Tutorial content with images
  const slides = [
    {
      title: "Events",
      image: concertImg,
      description:
        "Get to know when that next lunchtime concert is, when the next big tournament is, and then yeah.",
    },
    {
      title: "Sports",
      image: sportsImg,
      description:
        "Keep track of scores, catch a glimpse, and don't miss out on the school action.",
    },
    {
      title: "Notices",
      image: noticesImg,
      description:
        "Transform boring and mundane to quick-fire updates that keep you informed.",
    },
    {
      title: "Clubs and Communities",
      image: environmentclubImg,
      description: "All Brookhouse stories documented in one place.",
    },
  ];

  // Set up screen size on client side only
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window !== "undefined") {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Reset auto-slide timer when current slide changes
  useEffect(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }

    // Auto-slide after 3 seconds
    autoSlideIntervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 3000);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [currentIndex]);

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
  const cardWidth = isMobile
    ? Math.min(320, screenSize.width * 0.85)
    : Math.min(380, screenSize.width * 0.8);
  const cardHeight = isMobile
    ? Math.min(480, screenSize.height * 0.7)
    : Math.min(550, screenSize.height * 0.7);
  const offsetMultiplier = isMobile ? 0.4 : 0.55; // Less offset on mobile

  return (
    <>
      {/* Blur background overlay */}
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        backdropFilter="blur(8px)"
        bgColor="rgba(0, 0, 0, 0.4)"
        zIndex="1001"
        animation="blurIn 0.5s forwards"
        sx={{
          "@keyframes blurIn": {
            from: {
              backdropFilter: "blur(0)",
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
            to: {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        }}
      />

      {/* Slider container */}
      <Flex
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="100%"
        height="100%"
        justify="center"
        align="center"
        zIndex="1002"
        sx={{ perspective: "1000px" }}
      >
        {/* Close button */}
        <Button
          position="absolute"
          top={isMobile ? "16px" : "20px"}
          right={isMobile ? "16px" : "20px"}
          width={isMobile ? "32px" : "36px"}
          height={isMobile ? "32px" : "36px"}
          bg="rgba(0, 0, 0, 0.5)"
          color="white"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          zIndex="1003"
          transition="transform 0.2s ease"
          _hover={{ transform: "rotate(90deg)" }}
          onClick={handleComplete}
          p="0"
        >
          <Icon as={CloseIcon} />
        </Button>

        {/* Slides */}
        {slides.map((slide, index) => {
          const position = getSlidePosition(index);
          let transform;
          let opacity;
          let zIndex;

          switch (position) {
            case "left":
              transform = `translateX(-${
                cardWidth * offsetMultiplier
              }px) rotateY(30deg) scale(0.9)`;
              opacity = 0.7;
              zIndex = 1;
              break;
            case "center":
              transform = "translateX(0) rotateY(0deg) scale(1)";
              opacity = 1;
              zIndex = 2;
              break;
            case "right":
              transform = `translateX(${
                cardWidth * offsetMultiplier
              }px) rotateY(-30deg) scale(0.9)`;
              opacity = 0.7;
              zIndex = 1;
              break;
            default:
              transform = `translateX(${
                cardWidth * 1.1
              }px) rotateY(-30deg) scale(0.9)`;
              opacity = 0;
              zIndex = 0;
              break;
          }

          return (
            <Box
              key={index}
              position="absolute"
              width={`${cardWidth}px`}
              height={`${cardHeight}px`}
              borderRadius="20px"
              boxShadow="0 8px 16px rgba(0, 0, 0, 0.3)"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              transition="transform 0.5s ease, opacity 0.5s ease"
              cursor="pointer"
              transform={transform}
              opacity={opacity}
              zIndex={zIndex}
              onClick={() => {
                if (position === "center") goToNextSlide();
                else if (position === "left") goToPreviousSlide();
              }}
              _hover={
                position === "center"
                  ? {
                      transform: "translateX(0) rotateY(0deg) scale(1.03)",
                    }
                  : {}
              }
            >
              {/* Full image container */}
              <Box
                position="relative"
                width="100%"
                height="100%"
                overflow="hidden"
                borderRadius="20px"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  objectPosition="center"
                  fallbackSrc={pearImg}
                  onError={(e) => {
                    console.error(`Failed to load image: ${slide.image}`);
                    e.target.src = pearImg;
                  }}
                />

                {/* Status indicator pill */}
                {index === currentIndex && (
                  <Box
                    position="absolute"
                    top="20px"
                    left="20px"
                    bg="rgba(0, 0, 0, 0.5)"
                    color="white"
                    padding={isMobile ? "6px 12px" : "8px 16px"}
                    borderRadius="20px"
                    fontSize={isMobile ? "12px" : "14px"}
                    zIndex="3"
                    display="flex"
                    alignItems="center"
                    gap="5px"
                  >
                    <span>New</span>
                  </Box>
                )}

                {/* Text overlay with gradient */}
                <Box
  position="absolute"
  bottom="0"
  left="0"
  width="100%"
  height="42.5%" // Increased height to start lower
  background="linear-gradient(
    to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 35%,
        rgba(0, 0, 0, 0.001) 40%,
        rgba(0, 0, 0, 0.003) 45%,
        rgba(0, 0, 0, 0.008) 50%,
        rgba(0, 0, 0, 0.015) 55%,
        rgba(0, 0, 0, 0.03) 60%,
        rgba(0, 0, 0, 0.06) 65%,
        rgba(0, 0, 0, 0.12) 70%,
        rgba(0, 0, 0, 0.24) 75%,
        rgba(0, 0, 0, 0.4) 80%,
        rgba(0, 0, 0, 0.6) 90%,
        rgba(0, 0, 0, 0.7) 100%
  )"
  display="flex"
  flexDirection="column"
  justifyContent="flex-end"
  padding={isMobile ? "20px 16px" : "30px 20px"}
  color={textColor}
  zIndex="2"
  backdropFilter="blur(28px)" // Increased blur amount
  sx={{ WebkitBackdropFilter: "blur(28px)" }}
>

                  <Box
                    as="h2"
                    fontSize={isMobile ? "26px" : "32px"}
                    margin={`0 0 ${isMobile ? "6px" : "10px"} 0`}
                    fontWeight="600"
                    textShadow="0 1px 3px rgba(0, 0, 0, 0.3)"
                  >
                    {slide.title}
                  </Box>
                  <Box
                    as="p"
                    fontSize={isMobile ? "14px" : "16px"}
                    margin="0"
                    opacity="0.9"
                    textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                  >
                    {slide.description}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* Done button */}
        <Button
          position="absolute"
          bottom={isMobile ? "16px" : "20px"}
          right={isMobile ? "16px" : "20px"}
          padding={isMobile ? "10px 20px" : "12px 24px"}
          bg="#38A169"
          color="white"
          border="none"
          borderRadius="20px"
          cursor="pointer"
          zIndex="1003"
          transition="transform 0.2s ease, box-shadow 0.2s ease"
          fontWeight="600"
          fontSize={isMobile ? "14px" : "16px"}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onClick={handleComplete}
        >
          Done
        </Button>
      </Flex>
    </>
  );
};

export default TutorialSlider;
