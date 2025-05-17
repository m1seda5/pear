import { Box, Text, Button, VStack, useBreakpointValue, useToast, useColorMode } from "@chakra-ui/react";
import { useState } from "react";
import { usePointPopUp } from "../context/PointPopUpContext";

const placeholderQuestion = {
  question: "Which country has the most natural lakes in the world?",
  options: ["Canada", "Russia", "Brazil"],
};

const DailyQuestionWidget = () => {
  const show = useBreakpointValue({ base: false, md: true });
  const [answered, setAnswered] = useState(false);
  const triggerPopUp = usePointPopUp();
  const toast = useToast();
  const { colorMode } = useColorMode();
  if (!show) return null;

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
      bg="#F8F6FF"
      color="#2D1A4A"
      borderRadius="32px"
      p={8}
      mb={6}
      w="370px"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.13)"
      border="3px solid #7F53AC"
      textAlign="center"
      fontFamily="'Montserrat', 'Inter', sans-serif"
    >
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
  );
};

export default DailyQuestionWidget; 