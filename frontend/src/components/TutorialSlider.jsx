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
import pearmediaImg from "../assets/images/pearmedia.jpg";
import screensImg from "../assets/images/screens.jpg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// Import images
import concertImg from "../assets/images/concert.jpg";
import sportsImg from "../assets/images/sports.jpg";
import noticesImg from "../assets/images/notices.jpg";
import environmentclubImg from "../assets/images/environmentclub.jpg";
import liveeventsImg from "../assets/images/liveevents.jpg";
import pearImg from "../assets/images/pear.png";
import housepointsImg from "../assets/images/housepoints.png";
import Confetti from "react-confetti";

const TutorialSlider = ({ onComplete, isProfilePage = false }) => {
  const user = useRecoilValue(userAtom);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [textColor, setTextColor] = useState("white"); // Default to white
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });
  const autoSlideIntervalRef = useRef(null);
  
  // Check view count on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewCount = parseInt(localStorage.getItem("tutorialViewCount") || "0");
      if (viewCount >= 5) {
        handleComplete();
        return;
      }
      localStorage.setItem("tutorialViewCount", (viewCount + 1).toString());
    }
  }, []);

  // Slides setup
  let slides = [
    {
      title: "Welcome to Pear",
      image: pearmediaImg,
      description: "No more boring announcements. Pear lets you get updates, post, and connect — all in one place, made just for students.",
    },
    {
      title: "Track House Points",
      image: housepointsImg,
      description: "Track your house's progress and compete on Pear Media! House Points are updated live. Admins can manage points directly.",
      isHousePoints: true,
    },
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

  // Add teacher-only card if on profile page and user is teacher
  if (isProfilePage && user?.role === "teacher") {
    slides = [
      {
        title: "Screens",
        image: screensImg,
        description: "We give you the ability to post to your student or for a larger audience post to all or directly to screens.",
      },
    ];
  }

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

    // Auto-slide after 4 seconds
    autoSlideIntervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [currentIndex]);

  // Custom: Show confetti and longer display for house points card
  useEffect(() => {
    if (slides[currentIndex]?.isHousePoints) {
      // Show confetti and extend time
      if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = setInterval(() => {
        goToNextSlide();
      }, 8000); // 8 seconds for house points card
    }
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
              transform = `translateX(-${cardWidth * offsetMultiplier}px) rotateY(30deg) scale(0.9)`;
              opacity = 0.7;
              zIndex = 1;
              break;
            case "center":
              transform = "none";
              opacity = 1;
              zIndex = 2;
              break;
            case "right":
              transform = `translateX(${cardWidth * offsetMultiplier}px) rotateY(-30deg) scale(0.9)`;
              opacity = 0.7;
              zIndex = 1;
              break;
            default:
              transform = "scale(0.8)";
              opacity = 0;
              zIndex = 0;
          }

          // House Points card: custom rendering
          if (slide.isHousePoints && position === "center") {
            return (
              <Box
                key={index}
                position="absolute"
                left="50%"
                top="50%"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `translate(-50%, -50%) ${transform}`,
                  opacity,
                  zIndex,
                  background: useColorModeValue("#fff", "#232323"),
                  borderRadius: 24,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                  textAlign: "center",
                  border: `2px solid ${useColorModeValue('#e2e8f0', '#444')}`,
                }}
              >
                <Confetti width={cardWidth} height={cardHeight} recycle={false} numberOfPieces={180} />
                <Image src={slide.image} alt={slide.title} mb={4} borderRadius={16} w="80%" mx="auto" />
                <Box mt={2} mb={2}>
                  <Box fontWeight="bold" fontSize="2xl" color={useColorModeValue("orange.700", "yellow.300")}>{slide.title}</Box>
                  <Box fontSize="md" color={useColorModeValue("gray.700", "gray.200")}>{slide.description}</Box>
                </Box>
              </Box>
            );
          }

          // Default slide rendering
          return (
            <Box
              key={index}
              position="absolute"
              left="50%"
              top="50%"
              style={{
                width: cardWidth,
                height: cardHeight,
                transform: `translate(-50%, -50%) ${transform}`,
                opacity,
                zIndex,
                background: useColorModeValue("#fff", "#232323"),
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 32,
                textAlign: "center",
                border: `2px solid ${useColorModeValue('#e2e8f0', '#444')}`,
              }}
            >
              <Image src={slide.image} alt={slide.title} mb={4} borderRadius={16} w="80%" mx="auto" />
              <Box mt={2} mb={2}>
                <Box fontWeight="bold" fontSize="2xl" color={useColorModeValue("orange.700", "yellow.300")}>{slide.title}</Box>
                <Box fontSize="md" color={useColorModeValue("gray.700", "gray.200")}>{slide.description}</Box>
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