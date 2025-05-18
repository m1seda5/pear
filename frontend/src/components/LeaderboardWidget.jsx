import { Box, Flex, Text, useBreakpointValue, Image, useMediaQuery, IconButton } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { CloseIcon } from "@chakra-ui/icons";

const placeholderUsers = [
  { name: "ABI", points: 4000, badge: "emerald" },
  { name: "SCARLET", points: 2000, badge: "ruby" },
  { name: "MUNO", points: 1300, badge: "gold" },
  { name: "BOMBOGIKUHI", points: 700, badge: "silver" },
  { name: "IMRAN", points: 300, badge: "bronze" },
  { name: "MISEDA", points: 0, badge: "wood" },
  { name: "EXTRA", points: 0, badge: "wood" },
];

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

const DEFAULT_POSITION = { top: 100, left: 40 };

const LeaderboardWidget = () => {
  const show = useBreakpointValue({ base: false, md: true });
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("leaderboardWidgetPosition");
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
  const [isClosed, setIsClosed] = useState(() => sessionStorage.getItem("leaderboardClosed") === "true");

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 400),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 120)
        };
        localStorage.setItem("leaderboardWidgetPosition", JSON.stringify(newPos));
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
    const widget = document.getElementById("leaderboard-widget");
    const rect = widget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  if (!show || isClosed) return null;

  return (
    <Box
      id="leaderboard-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2500}
      borderRadius="32px"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="2px solid #fff3"
      fontFamily="'Montserrat', 'Inter', sans-serif"
      w="370px"
      bgGradient="linear(to-br, #7F53AC 0%, #647DEE 100%)"
      color="white"
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
          const widget = document.getElementById("leaderboard-widget");
          const rect = widget.getBoundingClientRect();
          dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
        } : undefined}
        userSelect="none"
        style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}
      >
        <Text fontWeight="bold" fontSize="xl">Leaderboard</Text>
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          aria-label="Close Leaderboard"
          bg="whiteAlpha.700"
          color="#7F53AC"
          _hover={{ bg: "whiteAlpha.900" }}
          onClick={() => {
            setIsClosed(true);
            sessionStorage.setItem("leaderboardClosed", "true");
          }}
        />
      </Flex>
      <Box p={8}>
        <Text fontSize="2.2rem" fontWeight="extrabold" mb={1} letterSpacing="0.08em" textAlign="center" textShadow="0 0 16px #fff8, 0 2px 8px #0008">CHAMPIONS</Text>
        <Text fontSize="1.1rem" fontWeight="bold" mb={5} textAlign="center" letterSpacing="0.12em" color="#FFD700" textShadow="0 1px 4px #0006">QUALIFICATION 1</Text>
        {placeholderUsers.map((user, i) => (
          <Flex key={user.name} align="center" justify="space-between" mb={i === placeholderUsers.length - 1 ? 0 : 3}>
            <Flex align="center" gap={3} minW="0">
              <Image src={badgeImages[user.badge]} alt={user.badge} boxSize="32px" mr={1} />
              <Text fontWeight="bold" fontSize="1.15rem" isTruncated>{user.name}</Text>
            </Flex>
            <Text fontWeight="extrabold" fontSize="1.35rem" letterSpacing="0.04em">
              {user.points} <Box as="span" fontSize="0.8em" fontWeight="semibold" color="#B0B0B0">PTS</Box>
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default LeaderboardWidget; 