import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// Import images for the first part
import concertImg from "../assets/images/concert.jpg";
import sportsImg from "../assets/images/sports.jpg";
import noticesImg from "../assets/images/notices.jpg";
import environmentclubImg from "../assets/images/environmentclub.jpg";
import liveeventsImg from "../assets/images/liveevents.jpg";
import pearImg from "../assets/images/pear.png";

// Import images for the second part (Pear Posting)
import card1 from "../assets/images/card1.jpg";
import card2 from "../assets/images/card2.jpg";
import card3 from "../assets/images/card3.jpg";
import card4 from "../assets/images/card4.jpg";

const TutorialSlider = ({ onComplete, userRole }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [textColor, setTextColor] = useState("white");
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [tutorialPart, setTutorialPart] = useState(1); // Part 1: Initial tutorial, Part 2: Pear Posting
  const [viewCount, setViewCount] = useState(0); // Track tutorial views
  const autoSlideIntervalRef = useRef(null);
  const lastTapRef = useRef(0); // To prevent rapid tapping

  // First part slides (unchanged)
  const slidesPart1 = [
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
      title: "Live Events",
      image: liveeventsImg,
      description:
        "Track the action, watch interviews and get live feedback through scores and interviews (COMING SOON) — all through the Brookhouse Journalism Club, only on Pear.",
    },
    {
      title: "Clubs and Communities",
      image: environmentclubImg,
      description: "All Brookhouse stories documented in one place.",
    },
  ];

  // Second part slides (Pear Posting) - Conditional based on user role with enhanced descriptions
  const slidesPart2 = [
    ...(userRole === "admin" || userRole === "teacher"
      ? [
          {
            title: "Target Your Audience",
            image: card1,
            description:
              "Effortlessly select a preset group of students, such as Year 12, to share tailored announcements or events. Whether it's a form room update or a school-wide event, choose your audience and ensure your message reaches the right students—streamlining communication like never before!",
          },
          {
            title: "Departmental Updates",
            image: card2,
            description:
              "Stay in the loop with departmental updates or meeting outcomes, and share them directly with your students in just a few clicks. From Math to Biology, keep everyone informed with targeted posts that foster collaboration and engagement across your department.",
          },
        ]
      : []),
    // Placeholder cards for all roles (admin, teacher, student) with enhanced descriptions
    {
      title: "Stay Connected",
      image: card3,
      description:
        "Join the conversation! Engage with posts, share ideas, and stay connected with your school community. Whether you're a student, teacher, or admin, Pear keeps you in the loop with updates that matter to you.",
    },
    {
      title: "Discover More",
      image: card4,
      description:
        "Explore a world of opportunities on Pear. From upcoming events to club activities, discover everything your school has to offer—all in one place, designed to keep you inspired and informed.",
    },
  ];

  // Current slides based on tutorial part
  const currentSlides = tutorialPart === 1 ? slidesPart1 : slidesPart2;

  // Load view count from localStorage and limit tutorial views to 30
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedViews = localStorage.getItem("tutorialViewCount") || 0;
      const views = parseInt(storedViews, 10);
      setViewCount(views);

      if (views >= 30) {
        setIsVisible(false);
        if (onComplete) onComplete();
      } else {
        localStorage.setItem("tutorialViewCount", views + 1);
      }
    }
  }, []);

  // Set up screen size on client side only
  useEffect(() => {
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

    // Auto-slide after 5 seconds (increased for reading time)
    autoSlideIntervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [currentIndex, tutorialPart]);

  // Function to go to the next slide
  const goToNextSlide = () => {
    if (currentIndex >= currentSlides.length - 1) {
      if (tutorialPart === 1) {
        // Move to Part 2
        setTutorialPart(2);
        setCurrentIndex(0);
      } else {
        // End of Part 2, complete the tutorial
        handleComplete();
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Function to handle tap-to-speed-up with throttle
  const handleTapNext = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    // Prevent tapping faster than 1 second apart
    if (timeSinceLastTap < 1000) return;

    lastTapRef.current = now;
    goToNextSlide();
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
  const offsetMultiplier = isMobile ? 0.4 : 0.55;

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
        {/* Close button - Only show in Part 2 at the end */}
        {tutorialPart === 2 && currentIndex === currentSlides.length - 1 && (
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
        )}

        {/* Welcome text for Part 2 */}
        {tutorialPart === 2 && currentIndex === 0 && (
          <Text
            position="absolute"
            top="10%"
            color="white"
            fontSize={isMobile ? "24px" : "32px"}
            fontWeight="700"
            textAlign="center"
            zIndex="1003"
            animation="fadeIn 1s ease-in-out"
            sx={{
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(-20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Welcome to Posting – Here’s a Quick Guide
          </Text>
        )}

        {/* Slides */}
        {currentSlides.map((slide, index) => {
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
              onClick={handleTapNext}
              _hover={
                position === "center"
                  ? {
                      transform: "translateX(0) rotateY(0deg) scale(1.03)",
                    }
                  : {}
              }
              // Enhanced glow effect inspired by the reference
              sx={{
                boxShadow:
                  position === "center"
                    ? "0 0 20px rgba(56, 161, 105, 0.8), 0 0 40px rgba(56, 161, 105, 0.4), 0 0 60px rgba(66, 153, 225, 0.2)"
                    : "none",
                transition: "box-shadow 0.5s ease",
              }}
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

                {/* Strong dark gradient overlay for better text visibility */}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  width="100%"
                  height="70%"
                  background="linear-gradient(
                    to top,
                    rgba(0, 0, 0, 0.85) 0%,
                    rgba(0, 0, 0, 0.75) 15%,
                    rgba(0, 0, 0, 0.6) 30%,
                    rgba(0, 0, 0, 0.4) 50%,
                    rgba(0, 0, 0, 0.2) 75%,
                    rgba(0, 0, 0, 0) 100%
                  )"
                  zIndex="1"
                  pointerEvents="none"
                />

                {/* Status indicator pill - show "New" for Live Events */}
                {index === currentIndex && tutorialPart === 1 && (
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

                {/* Text overlay on card */}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  width="100%"
                  height="50%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  padding={isMobile ? "20px 16px" : "30px 20px"}
                  color={textColor}
                  zIndex="2"
                >
                  <Box
                    as="h2"
                    fontSize={isMobile ? "26px" : "32px"}
                    margin={`0 0 ${isMobile ? "6px" : "10px"} 0`}
                    fontWeight="700"
                    textShadow="0 2px 4px rgba(0, 0, 0, 0.8)"
                    letterSpacing="0.5px"
                  >
                    {slide.title}
                    {slide.title === "Live Events" && (
                      <Box
                        as="span"
                        fontSize={isMobile ? "12px" : "14px"}
                        bg="rgba(255, 59, 48, 0.8)"
                        color="white"
                        ml="2"
                        py="1"
                        px="2"
                        borderRadius="full"
                        verticalAlign="middle"
                        fontWeight="600"
                        display="inline-block"
                      >
                        COMING SOON
                      </Box>
                    )}
                  </Box>
                  {tutorialPart === 1 && (
                    <Box
                      as="p"
                      fontSize={isMobile ? "14px" : "16px"}
                      margin="0"
                      opacity="1"
                      textShadow="0 1px 3px rgba(0, 0, 0, 0.9)"
                      lineHeight="1.6"
                      fontWeight="500"
                    >
                      {slide.description}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* Side text description for Part 2 */}
        {tutorialPart === 2 && (
          <Text
            position="absolute"
            right={isMobile ? "5%" : "10%"}
            top="50%"
            transform="translateY(-50%)"
            color="white"
            fontSize={isMobile ? "16px" : "20px"}
            fontWeight="500"
            maxWidth={isMobile ? "200px" : "300px"}
            opacity={currentSlides[currentIndex] ? 1 : 0}
            animation="fadeInSide 0.8s ease-in-out"
            sx={{
              "@keyframes fadeInSide": {
                from: { opacity: 0, transform: "translateX(20px)" },
                to: { opacity: 1, transform: "translateX(0)" },
              },
            }}
          >
            {currentSlides[currentIndex]?.description}
          </Text>
        )}

        {/* Next/Done button */}
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
          onClick={tutorialPart === 1 ? goToNextSlide : handleComplete}
        >
          {tutorialPart === 1 ? "Next" : "Done"}
        </Button>
      </Flex>
    </>
  );
};

export default TutorialSlider;
