import { Box, Flex, CloseButton } from "@chakra-ui/react";
import AnimatedTextCycle from "./AnimatedTextCycle";

export default function FirstStep({ onClose }) {
  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      bg="black"
      overflow="hidden"
      borderRadius="md"
    >
      {/* Particle-like background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        sx={{
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 2%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 2%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 2%)
            `,
            animation: "moveParticles 12s linear infinite",
          },
          "@keyframes moveParticles": {
            "0%": { transform: "translateY(0)" },
            "100%": { transform: "translateY(-100%)" },
          },
        }}
      />

      {/* Close Button */}
      <CloseButton
        position="absolute"
        top="3"
        right="3"
        size="lg"
        color="white"
        bg="blackAlpha.500"
        _hover={{ bg: "blackAlpha.700" }}
        onClick={onClose}
      />

      {/* Text Animation */}
      <Flex
        height="100%"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 8 }}
      >
        <AnimatedTextCycle
          texts={[
            "Welcome to Pear, your all-in-one connection hub",
            "This is the home of your announcements, notices, events, club information",
          ]}
          interval={4000}
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          color="white"
        />
      </Flex>
    </Box>
  );
}