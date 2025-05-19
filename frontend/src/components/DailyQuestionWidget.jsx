import { Box, Text, Button, VStack, useBreakpointValue, useToast, useColorMode, useMediaQuery, Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import { useState, useRef, useEffect, useContext } from "react";
import { usePointPopUp } from "../context/PointPopUpContext";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { CompetitionContext } from "../contexts/CompetitionContext";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

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
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [error, setError] = useState(null);
  const { competitionActive, showWidgets, competitionEnded } = useContext(CompetitionContext) || { 
    competitionActive: true, 
    showWidgets: true,
    competitionEnded: false 
  };

  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const triggerPopUp = usePointPopUp();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("#F8F6FF", "#232325");
  const textColor = useColorModeValue("#2D1A4A", "white");
  const borderColor = useColorModeValue("#7F53AC", "#23232b");

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

  useEffect(() => {
    fetchDailyQuestion();
  }, [competitionActive, competitionEnded]);

  const fetchDailyQuestion = async () => {
    if (!competitionActive || competitionEnded) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/daily-question/today", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setQuestion(data);
        setAnswered(data.answered);
      } else {
        if (data.error === "No questions available") {
          setQuestion(null);
          setError("No questions available for today. Check back tomorrow!");
        } else {
          setError(data.error || "Failed to fetch question");
        }
      }
    } catch (err) {
      setError("Failed to fetch question");
    } finally {
      setLoading(false);
    }
  };

  const startDrag = (e) => {
    setDragging(true);
    const widget = document.getElementById("daily-question-widget");
    const rect = widget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleAnswer = async (selectedAnswer) => {
    if (answered || !question) return;
    try {
      const res = await fetch("/api/daily-question/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: question._id,
          answer: selectedAnswer,
          userId: currentUser._id
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      if (data.correct) {
        setAnswered(true);
        triggerPopUp(25, colorMode);
        toast({
          title: "+25 Points!",
          description: "You answered the daily question correctly!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Incorrect",
          description: "Try again tomorrow!",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (!show || isClosed || !competitionActive || !showWidgets || competitionEnded) return null;

  return (
    <Box
      id="daily-question-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2500}
      borderRadius="32px"
      boxShadow="none"
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
        bg="transparent"
        color={textColor}
        borderTopLeftRadius="32px"
        borderTopRightRadius="32px"
        px={4}
        py={2}
        cursor={dragging ? "grabbing" : "grab"}
        onMouseDown={isLargerThan1024 ? startDrag : undefined}
        userSelect="none"
        style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}
      >
        <Text fontWeight="bold" fontSize="xl">Daily Question</Text>
        <Flex>
          {currentUser?.role === "admin" && (
            <IconButton
              icon={<EditIcon />}
              size="sm"
              aria-label="Edit Daily Questions"
              bg="whiteAlpha.700"
              color="#7F53AC"
              _hover={{ bg: "whiteAlpha.900" }}
              mr={2}
              onClick={() => navigate("/daily-questions/edit")}
            />
          )}
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
      </Flex>
      <Box p={8}>
        {loading ? (
          <Text>Loading question...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : !question ? (
          <VStack spacing={4}>
            <Text fontSize="1.15rem" fontWeight="semibold" textAlign="center">
              No question available for today
            </Text>
            <Text fontSize="0.9rem" color="gray.500" textAlign="center">
              Check back tomorrow for a new question!
            </Text>
          </VStack>
        ) : (
          <>
            <Text fontSize="2.1rem" fontWeight="extrabold" mb={2} color="#7F53AC" letterSpacing="0.08em">QUESTION</Text>
            <Text fontSize="1.15rem" fontWeight="semibold" mb={5} letterSpacing="0.01em">{question.question}</Text>
            <VStack spacing={4}>
              {question.options.map((opt, i) => (
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
                  onClick={() => handleAnswer(opt)}
                  isDisabled={answered}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </Button>
              ))}
            </VStack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DailyQuestionWidget; 