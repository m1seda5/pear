import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Progress,
  HStack,
  CloseButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

export default function TutorialSlider({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const autoAdvanceTimerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const bgOverlay = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(0, 0, 0, 0.8)");
  const cardBg = useColorModeValue("white", "gray.800");

  const steps = [
    { id: 1, component: FirstStep },
    { id: 2, component: SecondStep },
  ];

  // Check tutorial view limit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewCount = parseInt(localStorage.getItem("tutorialShownCount") || "0", 10);
      if (viewCount >= 30) {
        setShowTutorial(false);
        if (onComplete) onComplete();
      } else {
        localStorage.setItem("tutorialShownCount", (viewCount + 1).toString());
      }
    }
  }, [onComplete]);

  // Check if viewing on mobile device
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Auto-advance and pagination visibility
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    setShowPagination(false);

    const paginationTimer = setTimeout(() => {
      setShowPagination(true);
    }, 4000);

    autoAdvanceTimerRef.current = setTimeout(() => {
      if (currentStep >= steps.length - 1) {
        setCurrentStep(0);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, 5000);

    return () => {
      clearTimeout(paginationTimer);
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [currentStep]);

  const goToNextStep = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep <= 0) {
      setCurrentStep(steps.length - 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDismiss = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorialShownCount", "30");
    if (onComplete) onComplete();
  };

  if (!showTutorial) return null;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="1001"
      bgColor={bgOverlay}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        maxW={isMobile ? "90%" : "600px"}
        width="100%"
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
        position="relative"
        p="6"
      >
        {/* Close button */}
        <CloseButton
          position="absolute"
          top="3"
          right="3"
          size="md"
          zIndex="2"
          onClick={handleDismiss}
          _hover={{ bg: "blackAlpha.100" }}
        />

        {/* Component Title */}
        <Text
          fontSize={isMobile ? "xl" : "2xl"}
          fontWeight="bold"
          textAlign="center"
          mb="6"
        >
          Welcome to Pear
        </Text>

        {/* Slider Progress */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb="6"
          opacity={showPagination ? 1 : 0}
          transition="opacity 0.3s ease"
        >
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="Previous step"
            onClick={goToPreviousStep}
            variant="ghost"
            size={isMobile ? "sm" : "md"}
          />
          <HStack spacing="2" flex="1" px="4">
            {steps.map((step, index) => (
              <Progress
                key={step.id}
                value={index === currentStep ? 100 : index < currentStep ? 100 : 0}
                size="sm"
                colorScheme="green"
                borderRadius="full"
                flex="1"
              />
            ))}
          </HStack>
          <IconButton
            icon={<ChevronRightIcon />}
            aria-label="Next step"
            onClick={goToNextStep}
            variant="ghost"
            size={isMobile ? "sm" : "md"}
          />
        </Flex>

        {/* Content Area */}
        <Box
          height={isMobile ? "300px" : "400px"}
          borderRadius="md"
          overflow="hidden"
        >
          <CurrentStepComponent onClose={handleDismiss} />
        </Box>

        {/* Navigation Buttons */}
        <Flex justifyContent="center" mt="6">
          <Button
            colorScheme="green"
            onClick={handleDismiss}
            size={isMobile ? "sm" : "md"}
          >
            Got it
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

function IconButton({ icon, onClick, variant, size, "aria-label": ariaLabel }) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      aria-label={ariaLabel}
    >
      {icon}
    </Button>
  );
}