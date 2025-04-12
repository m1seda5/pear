import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import concertImg from "../assets/images/concert.jpg";
import sportsImg from "../assets/images/sports.jpg";
import noticesImg from "../assets/images/notices.jpg";
import environmentclubImg from "../assets/images/environmentclub.jpg";
import liveeventsImg from "../assets/images/liveevents.jpg";
import pearImg from "../assets/images/pear.png";

const TutorialSlider = ({ onComplete, onNextToProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [showNext, setShowNext] = useState(false);
  const autoSlideIntervalRef = useRef(null);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  const slides = [
    { title: "Events", image: concertImg, description: "Get to know when that next lunchtime concert is, when the next big tournament is, and then yeah." },
    { title: "Sports", image: sportsImg, description: "Keep track of scores, catch a glimpse, and don't miss out on the school action." },
    { title: "Notices", image: noticesImg, description: "Transform boring and mundane to quick-fire updates that keep you informed." },
    { title: "Live Events", image: liveeventsImg, description: "Track the action, watch interviews and get live feedback through scores and interviews (COMING SOON) — all through the Brookhouse Journalism Club, only on Pear." },
    { title: "Clubs and Communities", image: environmentclubImg, description: "All Brookhouse stories documented in one place." },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
    autoSlideIntervalRef.current = setInterval(goToNextSlide, 3000);
    return () => clearInterval(autoSlideIntervalRef.current);
  }, [currentIndex]);

  const goToNextSlide = () => {
    if (currentIndex >= slides.length - 1) {
      setShowNext(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (user) {
        onNextToProfile(user.username);
        navigate(`/${user.username}`);
      } else {
        onComplete();
      }
    }, 500);
  };

  if (!isVisible) return null;

  const getSlidePosition = (index) => {
    if (index === currentIndex) return "center";
    if (index === currentIndex - 1) return "left";
    if (index === currentIndex + 1) return "right";
    return "hidden";
  };

  const isMobile = screenSize.width < 768;
  const cardWidth = isMobile ? Math.min(320, screenSize.width * 0.85) : Math.min(380, screenSize.width * 0.8);
  const cardHeight = isMobile ? Math.min(480, screenSize.height * 0.7) : Math.min(550, screenSize.height * 0.7);
  const offsetMultiplier = isMobile ? 0.4 : 0.55;

  return (
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
      {slides.map((slide, index) => {
        const position = getSlidePosition(index);
        let transform, opacity, zIndex;
        switch (position) {
          case "left":
            transform = `translateX(-${cardWidth * offsetMultiplier}px) rotateY(30deg) scale(0.9)`;
            opacity = 0.7;
            zIndex = 1;
            break;
          case "center":
            transform = "translateX(0) rotateY(0deg) scale(1)";
            opacity = 1;
            zIndex = 2;
            break;
          case "right":
            transform = `translateX(${cardWidth * offsetMultiplier}px) rotateY(-30deg) scale(0.9)`;
            opacity = 0.7;
            zIndex = 1;
            break;
          default:
            transform = `translateX(${cardWidth * 1.1}px) rotateY(-30deg) scale(0.9)`;
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
            transform={transform}
            opacity={opacity}
            zIndex={zIndex}
          >
            <Box position="relative" width="100%" height="100%" overflow="hidden" borderRadius="20px">
              <Image src={slide.image} alt={slide.title} w="100%" h="100%" objectFit="cover" fallbackSrc={pearImg} />
              <Box
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                height="70%"
                background="linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0))"
                zIndex="1"
                pointerEvents="none"
              />
              {index === currentIndex && (
                <Box position="absolute" top="20px" left="20px" bg="rgba(0, 0, 0, 0.5)" color="white" padding="8px 16px" borderRadius="20px" fontSize="14px" zIndex="3">
                  New
                </Box>
              )}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                height="50%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                padding="30px 20px"
                color="white"
                zIndex="2"
              >
                <Box as="h2" fontSize="32px" margin="0 0 10px 0" fontWeight="700" textShadow="0 2px 4px rgba(0, 0, 0, 0.8)">
                  {slide.title}
                  {slide.title === "Live Events" && (
                    <Box as="span" fontSize="14px" bg="rgba(255, 59, 48, 0.8)" color="white" ml="2" py="1" px="2" borderRadius="full">COMING SOON</Box>
                  )}
                </Box>
                <Box as="p" fontSize="16px" margin="0" textShadow="0 1px 3px rgba(0, 0, 0, 0.9)" lineHeight="1.6" fontWeight="500">
                  {slide.description}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
      {showNext && (
        <Button
          position="absolute"
          bottom={isMobile ? "16px" : "20px"}
          right={isMobile ? "16px" : "20px"}
          padding="12px 24px"
          bg="#38A169"
          color="white"
          borderRadius="20px"
          zIndex="1003"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
          onClick={handleNext}
          fontWeight="600"
          fontSize="16px"
        >
          Next
        </Button>
      )}
    </Flex>
  );
};

export default TutorialSlider;