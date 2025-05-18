import { Box, Text, Button, VStack, useBreakpointValue, useToast, useColorMode, useMediaQuery, Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { usePointPopUp } from "../context/PointPopUpContext";
import { CloseIcon } from "@chakra-ui/icons";

const placeholderQuestion = {
  question: "Which country has the most natural lakes in the world?",
  options: ["Canada", "Russia", "Brazil"],
};

const DEFAULT_POSITION = { top: 100, left: 440 };

const DailyQuestionWidget = () => {
  const show = useBreakpointValue({ base: false, md: true });
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [isClosed, setIsClosed] = useState(() => sessionStorage.getItem("dailyQuestionClosed") === "true");
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("dailyQuestionWidgetPosition");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_POSITION;
      }
    }
    return DEFAULT_POSITION;
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 400),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 120)
        };
        localStorage.setItem("dailyQuestionWidgetPosition", JSON.stringify(newPos));
        return newPos;
      });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const startDrag = (e) => {
    setDragging(true);
    const widget = document.getElementById("daily-question-widget");
    const rect = widget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const [answered, setAnswered] = useState(false);
  const triggerPopUp = usePointPopUp();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("#F8F6FF", "#23232b");
  const textColor = useColorModeValue("#2D1A4A", "white");
  const borderColor = useColorModeValue("#7F53AC", "#23232b");
  if (!show || isClosed) return null;

  const handleAnswer = () => {
    if (answered) return;
    setAnswered(true);
    triggerPopUp(25, colorMode);
    toast({
      title: "+25 Points!",
      description: "You answered the daily question!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      id="daily-question-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2500}
      borderRadius="32px"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.13)"
      border="2px solid"
      borderColor={borderColor}
      fontFamily="'Montserrat', 'Inter', sans-serif"
      w="370px"
      bg={bg}
      color={textColor}
      p={0}
      mb={6}
      userSelect={dragging ? "none" : "auto"}
      display={{ base: "none", md: "block" }}
      style={{ transition: 'box-shadow 0.2s, left 0.2s, top 0.2s' }}
    >
      <Flex
        align="center"
        justify="space-between"
        bg="whiteAlpha.700"
        color="#7F53AC"
        borderTopLeftRadius="32px"
        borderTopRightRadius="32px"
        px={4}
        py={2}
        cursor={dragging ? "grabbing" : "grab"}
        onMouseDown={isLargerThan1024 ? (e) => {
          setDragging(true);
          const widget = document.getElementById("daily-question-widget");
          const rect = widget.getBoundingClientRect();
          dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
        } : undefined}
        userSelect="none"
        style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}
      >
        <Text fontWeight="bold" fontSize="xl">Daily Question</Text>
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          aria-label="Close Daily Question"
          bg="whiteAlpha.700"
          color="#7F53AC"
          _hover={{ bg: "whiteAlpha.900" }}
          onClick={() => {
            setIsClosed(true);
            sessionStorage.setItem("dailyQuestionClosed", "true");
          }}
        />
      </Flex>
      <Box p={8}>
        <Text fontSize="2.1rem" fontWeight="extrabold" mb={2} color="#7F53AC" letterSpacing="0.08em" textShadow="0 0 12px #fff8">QUESTION</Text>
        <Text fontSize="1.15rem" fontWeight="semibold" mb={5} letterSpacing="0.01em">{placeholderQuestion.question}</Text>
        <VStack spacing={4}>
          {placeholderQuestion.options.map((opt, i) => (
            <Button
              key={opt}
              w="100%"
              colorScheme="purple"
              variant="outline"
              borderRadius="xl"
              fontWeight="bold"
              fontSize="1.1rem"
              py={6}
              borderWidth={2}
              borderColor="#7F53AC"
              onClick={handleAnswer}
              isDisabled={answered}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </Button>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default DailyQuestionWidget; 