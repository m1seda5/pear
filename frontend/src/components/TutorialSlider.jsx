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
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// Import slide images
import slide1 from "../assets/images/slide1.png";
import slide2 from "../assets/images/slide2.png";
import slide3 from "../assets/images/slide3.png";
import slide4 from "../assets/images/slide4.png";
import slide5 from "../assets/images/slide5.png";
import slide6 from "../assets/images/slide6.png";
import slide7 from "../assets/images/slide7.png";
import slide8 from "../assets/images/slide8.png";

const TutorialSlider = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];
  const autoSlideIntervalRef = useRef(null);

  // Use a new key to reset for all users
  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewCount = parseInt(localStorage.getItem("tutorialViewCountV2") || "0");
      if (viewCount >= 4) {
        handleComplete();
        return;
      }
      localStorage.setItem("tutorialViewCountV2", (viewCount + 1).toString());
    }
  }, []);

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

  // Restore auto-slide, a bit faster (~3s)
  useEffect(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    autoSlideIntervalRef.current = setInterval(() => {
      goToNextSlide(true);
    }, 3000);
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [currentIndex]);

  const goToNextSlide = (fromAuto = false) => {
    if (currentIndex >= slides.length - 1) {
      handleComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  // Calculate size based on screen dimensions
  const isMobile = screenSize.width < 768;
  if (isMobile) return null;
  const cardWidth = isMobile
    ? Math.min(320, screenSize.width * 0.85)
    : Math.min(380, screenSize.width * 0.8);
  const cardHeight = isMobile
    ? Math.min(480, screenSize.height * 0.7)
    : Math.min(520, screenSize.height * 0.7);

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      zIndex={2000}
      bg="rgba(0,0,0,0.45)"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <Box
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="2xl"
        boxShadow="2xl"
        p={0}
        w={cardWidth}
        h={cardHeight}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
        transition="box-shadow 0.3s, background 0.3s"
      >
        <Icon
          as={CloseIcon}
          boxSize={4}
          color="gray.400"
          position="absolute"
          top={3}
          right={3}
          cursor="pointer"
          onClick={handleComplete}
        />
        <Image
          src={slides[currentIndex]}
          alt={"Tutorial Slide " + (currentIndex + 1)}
          w="100%"
          h="100%"
          objectFit="contain"
          borderRadius="2xl"
          draggable={false}
          userSelect="none"
          transition="all 0.4s cubic-bezier(0.4,0,0.2,1)"
        />
        <Flex
          position="absolute"
          bottom={4}
          left={0}
          w="100%"
          justify="space-between"
          px={6}
        >
          <Button
            onClick={goToPreviousSlide}
            isDisabled={currentIndex === 0}
            variant="ghost"
            colorScheme="pink"
            fontWeight="bold"
            fontSize="lg"
            px={4}
          >
            Previous
          </Button>
          <Button
            onClick={() => goToNextSlide(false)}
            colorScheme="pink"
            fontWeight="bold"
            fontSize="lg"
            px={4}
          >
            {currentIndex === slides.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default TutorialSlider;