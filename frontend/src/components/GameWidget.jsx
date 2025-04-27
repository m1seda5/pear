import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Spinner,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Example data (replace with your real data or props)
const exampleGame = {
  venue: "St. Anfield",
  leagueLogo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
  timer: "87:38",
  teamA: {
    name: "LA Clippers",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/bb/Los_Angeles_Clippers_logo.svg", // or null
  },
  teamB: {
    name: "Denver Nuggets",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg", // or null
  },
  scoreA: 99,
  scoreB: 101,
  status: "final", // "live", "final", "upcoming"
  details: "Playoffs Round 1 · Game 4 (Series tied 2–2)",
  league: "NBA",
  date: "Today",
};

const GameWidget = ({ game = exampleGame }) => {
  const {
    venue,
    leagueLogo,
    timer,
    teamA,
    teamB,
    scoreA,
    scoreB,
    status,
    details,
    league,
    date,
  } = game;

  return (
    <Box
      bg="#000"
      borderRadius="32px"
      p="16px 24px"
      color="white"
      w="320px"
      boxShadow="0px 4px 20px rgba(0,0,0,0.5)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    >
      {/* Title Row */}
      <Text fontSize="22px" fontWeight="600" w="100%" mb={1} textAlign="left">
        {teamA.name} vs {teamB.name}
      </Text>
      {/* Sub Row */}
      <Flex w="100%" justify="flex-start" align="center" mb="8px" fontSize="15px" color="#ccc" gap={2}>
        <Text>{league}</Text>
        <Text>·</Text>
        <Text>{date}</Text>
      </Flex>
      {/* Top Row */}
      <Flex w="100%" justify="space-between" align="center" mb="12px" fontSize="14px" color="#ccc">
        <Text>{venue}</Text>
        <Image src={leagueLogo} boxSize="24px" filter="invert(1)" alt="League Logo" />
        <Box bg="#2c2c2c" px="10px" py="4px" borderRadius="16px" fontSize="12px">
          {timer}
        </Box>
      </Flex>
      {/* Main Card */}
      <Flex
        bg="#121212"
        borderRadius="24px"
        p="16px 24px"
        w="100%"
        justify="space-between"
        align="center"
      >
        {/* Team A */}
        <Flex direction="column" align="center" fontSize="14px" gap="4px">
          {teamA.logo ? (
            <Image src={teamA.logo} alt={teamA.name} boxSize="40px" mb={1} />
          ) : (
            <Avatar name={teamA.name} boxSize="40px" mb={1} />
          )}
          <Text>{teamA.name}</Text>
        </Flex>
        {/* Score */}
        <Flex align="center" fontSize="32px" fontWeight="600" gap="8px">
          {scoreA}:{scoreB}
          {status === "live" && (
            <Box
              bg="#d11a2a"
              color="white"
              px="10px"
              py="4px"
              borderRadius="12px"
              fontWeight="bold"
              fontSize="12px"
              ml={2}
            >
              ● Live
            </Box>
          )}
          {status === "final" && (
            <Box
              bg="#444"
              color="white"
              px="10px"
              py="4px"
              borderRadius="12px"
              fontWeight="bold"
              fontSize="12px"
              ml={2}
            >
              Final
            </Box>
          )}
        </Flex>
        {/* Team B */}
        <Flex direction="column" align="center" fontSize="14px" gap="4px">
          {teamB.logo ? (
            <Image src={teamB.logo} alt={teamB.name} boxSize="40px" mb={1} />
          ) : (
            <Avatar name={teamB.name} boxSize="40px" mb={1} />
          )}
          <Text>{teamB.name}</Text>
        </Flex>
      </Flex>
      {/* Details */}
      <Text mt={3} fontSize="15px" color="#ccc" textAlign="center">
        {details}
      </Text>
    </Box>
  );
};

export default GameWidget;