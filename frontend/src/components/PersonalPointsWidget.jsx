import { Box, Flex, Text, Avatar, useColorModeValue } from "@chakra-ui/react";
import { useState, useRef, useEffect, useContext } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { CompetitionContext } from "../context/CompetitionContext";

const badgeImages = {
  champion: "/championbadge.png",
  sapphire: "/saphirebadge.png",
  emerald: "/emeraldbadge.png",
  ruby: "/rubybadge.png",
  gold: "/goldbadge.png",
  silver: "/silverbadge.png",
  bronze: "/bronzebadge.png",
  wood: "/woodbadge.png",
};

const DEFAULT_POSITION = { top: 100, left: 840 };

const PersonalPointsWidget = () => {
  const [userData, setUserData] = useState(null);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("personalPointsWidgetPosition");
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
  const bgColor = useColorModeValue("white", "#18181b");
  const borderColor = useColorModeValue("gray.200", "#232325");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const { competitionActive, showWidgets, competitionEnded } = useContext(CompetitionContext) || { 
    competitionActive: true, 
    showWidgets: true,
    competitionEnded: false 
  };

  useEffect(() => {
    if (!competitionActive || competitionEnded) return;
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
      })
      .catch(() => {
        setUserData({ points: 0, lastBadge: "Wood League" });
      });
  }, [competitionActive, competitionEnded]);

  if (!showWidgets || competitionEnded) return null;

  const badge = userData?.lastBadge || "wood";
  const displayPoints = userData?.points || 0;

  return (
    <Box
      id="personal-points-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2500}
      borderRadius="28px"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="2px solid"
      borderColor={borderColor}
      textAlign="center"
      fontFamily="'Montserrat', 'Inter', sans-serif"
      w="300px"
      bg={bgColor}
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
        color={textColor}
        borderTopLeftRadius="28px"
        borderTopRightRadius="28px"
        px={4}
        py={2}
        cursor={dragging ? "grabbing" : "grab"}
        onMouseDown={(e) => {
          setDragging(true);
          const widget = document.getElementById("personal-points-widget");
          const rect = widget.getBoundingClientRect();
          dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
        }}
        userSelect="none"
        style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}
      >
        <Text fontWeight="bold" fontSize="xl">{badge === "wood" ? "Wood League" : badge.charAt(0).toUpperCase() + badge.slice(1) + " League"}</Text>
      </Flex>
      <Box p={7} pt={4}>
        <Flex align="center" justify="center" gap={4}>
          <Text fontWeight="extrabold" fontSize="2.1rem" letterSpacing="0.04em">
            {displayPoints} <Box as="span" fontSize="0.8em" fontWeight="semibold" color="#B0B0B0">PTS</Box>
          </Text>
          <Avatar size="lg" src={badgeImages[badge]} name={badge} bg="transparent" boxSize="48px" />
        </Flex>
      </Box>
    </Box>
  );
};

export default PersonalPointsWidget;