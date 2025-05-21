import { Box, Flex, Text, useBreakpointValue, Avatar, useColorModeValue } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

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

const BADGE_THRESHOLDS = {
  champion: 5000,
  sapphire: 4000,
  emerald: 3000,
  ruby: 2000,
  gold: 1000,
  silver: 500,
  bronze: 100,
  wood: 0
};

const getCurrentBadge = (points) => {
  for (const [badge, threshold] of Object.entries(BADGE_THRESHOLDS)) {
    if (points >= threshold) {
      return badge;
    }
  }
  return "wood";
};

const DEFAULT_POSITION = { top: 100, left: 20 }; // Changed default position to be more visible

const PersonalPointsWidget = () => {
  // Always show the widget regardless of screen size
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
  const currentUser = useRecoilValue(userAtom);
  const bgColor = useColorModeValue("white", "#18181b");
  const borderColor = useColorModeValue("gray.200", "#232325");
  const textColor = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 340),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 120)
        };
        localStorage.setItem("personalPointsWidgetPosition", JSON.stringify(newPos));
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

  // Debug log with more details
  console.log('[PersonalPointsWidget] currentUser:', currentUser ? 'exists' : 'missing', 'points:', currentUser?.points);

  // Only check if currentUser exists
  if (!currentUser) {
    console.log('[PersonalPointsWidget] Not rendering: currentUser is missing');
    return null;
  }

  const currentBadge = getCurrentBadge(currentUser.points || 0);

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
      display="block" // Always display the widget
      style={{ transition: 'box-shadow 0.2s' }}
    >
      {/* Drag handle bar */}
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
        <Text fontWeight="bold" fontSize="xl">My Points</Text>
      </Flex>
      {/* Widget content */}
      <Box p={7} pt={4}>
        <Flex align="center" justify="center" gap={4}>
          <Text fontWeight="extrabold" fontSize="2.1rem" letterSpacing="0.04em">
            {currentUser.points || 0} <Box as="span" fontSize="0.8em" fontWeight="semibold" color="#B0B0B0">PTS</Box>
          </Text>
          <Avatar size="lg" src={badgeImages[currentBadge]} name={currentBadge} bg="transparent" boxSize="48px" />
        </Flex>
      </Box>
    </Box>
  );
};

export default PersonalPointsWidget;