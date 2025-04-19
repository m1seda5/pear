import { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

export default function AnimatedTextCycle({
  texts,
  interval = 5000,
  fontSize = "4xl",
  fontWeight = "bold",
  color = "white",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, texts.length]);

  return (
    <Box position="relative" display="inline-block" overflow="hidden">
      {texts.map((text, index) => (
        <Text
          key={index}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
          position={index === currentIndex ? "relative" : "absolute"}
          top={index === currentIndex ? "0" : "100%"}
          opacity={index === currentIndex ? 1 : 0}
          transition="all 0.4s ease-out"
          whiteSpace="pre-wrap"
          textAlign="center"
        >
          {text}
        </Text>
      ))}
    </Box>
  );
}