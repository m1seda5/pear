import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Badge, Image, IconButton, useColorModeValue, Button } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import Confetti from "react-confetti";

const DEFAULT_POSITION = { top: 300, left: typeof window !== 'undefined' ? window.innerWidth - 340 : 100 };
const statusColors = { upcoming: "yellow", live: "green", final: "gray" };

// Mock game data for demo
const mockGame = {
  home: { short_name: "GSW", logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg" },
  away: { short_name: "IND", logo: "https://upload.wikimedia.org/wikipedia/en/1/1b/Indiana_Pacers.svg" },
  sport: "Basketball",
  category: "Boys",
  startTime: new Date().toISOString(),
  status: "final",
  score: { home: 132, away: 100 },
  confettiTeam: "GSW",
  winner: "GSW",
};

const GameWidget = ({ game = mockGame }) => {
  const [isOpen, setIsOpen] = useState(() => sessionStorage.getItem("gameWidgetClosed") !== "true");
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("gameWidgetPosition");
    if (saved) try { return JSON.parse(saved); } catch { return DEFAULT_POSITION; }
    return DEFAULT_POSITION;
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const widgetBg = useColorModeValue("pink.baby", "rgba(20,20,20,0.95)");
  const borderCol = useColorModeValue("pink.main", "gray.700");

  // Confetti logic: show if user team won and confettiTeam matches winner
  useEffect(() => {
    if (game.status === "final" && game.confettiTeam === game.winner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [game.status, game.confettiTeam, game.winner]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 380),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 80)
        };
        localStorage.setItem("gameWidgetPosition", JSON.stringify(newPos));
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
    const widget = document.getElementById("game-widget");
    const rect = widget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Admin double-tap to expand
  const lastTap = useRef(0);
  const isAdmin = true; // Replace with your admin check
  const handleWidgetTap = () => {
    if (!isAdmin) return;
    const now = Date.now();
    if (now - lastTap.current < 300) setExpanded(e => !e);
    lastTap.current = now;
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("gameWidgetClosed", "true");
  };

  useEffect(() => {
    if (isOpen) sessionStorage.setItem("gameWidgetClosed", "false");
  }, [isOpen]);

  if (!isOpen || window.innerWidth < 1024) return null;

  return (
    <Box
      id="game-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2000}
      w={expanded ? "520px" : "320px"}
      bg={widgetBg}
      borderRadius="16px"
      p={expanded ? 8 : 4}
      boxShadow="2xl"
      border={`1.5px solid ${borderCol}`}
      cursor={dragging ? "grabbing" : "default"}
      userSelect={dragging ? "none" : "auto"}
      transition="width 0.2s, padding 0.2s"
      onClick={handleWidgetTap}
    >
      {showConfetti && <Confetti width={expanded ? 520 : 320} height={expanded ? 300 : 180} recycle={false} numberOfPieces={180} />}
      <Flex justify="space-between" align="center" mb={2} onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <Text fontWeight="bold" fontSize="xl" color={useColorModeValue("black", "white")}>Game</Text>
        <IconButton icon={<CloseIcon />} size="sm" onClick={e => { e.stopPropagation(); handleClose(); }} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
      </Flex>
      {/* Expanded admin panel */}
      {expanded && isAdmin ? (
        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={4}>Admin Game Editor (Demo)</Text>
          {/* Add your admin modal fields here */}
          <Button colorScheme="blue" mb={2} w="full">Save Changes</Button>
          <Button colorScheme="red" variant="outline" w="full">Delete Game</Button>
        </Box>
      ) : (
        <Flex align="center" justify="space-between" p={2}>
          {/* Home Team */}
          <Flex align="center" gap={2} minW="90px">
            <Image src={game.home.logo} alt={game.home.short_name} boxSize="40px" borderRadius="full" />
            <Text fontWeight="bold">{game.home.short_name}</Text>
          </Flex>
          {/* Center Info */}
          <Box textAlign="center">
            <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.300')}>{game.sport} • {game.category}</Text>
            <Text fontSize="xs" color={useColorModeValue('gray.400', 'gray.400')}>{new Date(game.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Badge colorScheme={statusColors[game.status]} borderRadius="full" px={2} mt={1} fontSize="0.8em">
              {game.status === 'upcoming' && 'Upcoming'}
              {game.status === 'live' && 'Live'}
              {game.status === 'final' && 'Final'}
            </Badge>
            {(game.status === 'live' || game.status === 'final') && (
              <Text fontWeight="bold" fontSize="lg" mt={1}>{game.score.home} - {game.score.away}</Text>
            )}
          </Box>
          {/* Away Team */}
          <Flex align="center" gap={2} minW="90px">
            <Text fontWeight="bold">{game.away.short_name}</Text>
            <Image src={game.away.logo} alt={game.away.short_name} boxSize="40px" borderRadius="full" />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default GameWidget; 