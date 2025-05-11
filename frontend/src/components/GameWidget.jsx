import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Badge,
  Button,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import { CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const DEFAULT_POSITION = { top: 280, left: typeof window !== 'undefined' ? window.innerWidth - 400 : 100 };

const GameWidget = ({ isAdmin }) => {
  const [games, setGames] = useState([]);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("gameWidgetPosition");
    if (saved) try { return JSON.parse(saved); } catch { return DEFAULT_POSITION; }
    return DEFAULT_POSITION;
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [isWidgetOpen, setIsWidgetOpen] = useState(() => sessionStorage.getItem("gameWidgetClosed") !== "true");
  const { socket } = useSocket();

  const widgetBg = useColorModeValue("rgba(255,255,255,0.85)", "rgba(20,20,20,0.95)");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("black", "white");

  useEffect(() => {
    // Fetch initial games
    const fetchGames = async () => {
      try {
        const res = await axios.get("https://pear-tsk2.onrender.com/api/games");
        setGames(res.data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };
    fetchGames();

    if (!socket) return;

    // Socket.IO listeners
    socket.on("gameUpdated", updatedGame => {
      setGames(prev => prev.map(g => g._id === updatedGame._id ? updatedGame : g));
    });

    socket.on("gameCreated", newGame => {
      setGames(prev => [...prev, newGame]);
    });

    socket.on("scoreUpdated", ({ gameId, teamIndex, score }) => {
      setGames(prev => prev.map(game => {
        if (game._id === gameId) {
          const newGame = { ...game };
          newGame.teams[teamIndex].score = score;
          return newGame;
        }
        return game;
      }));
    });

    socket.on("gameDeleted", (gameId) => {
      setGames(prev => prev.filter(g => g._id !== gameId));
    });

    return () => {
      socket.off("gameUpdated");
      socket.off("gameCreated");
      socket.off("scoreUpdated");
      socket.off("gameDeleted");
    };
  }, [socket]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 460),
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

  const handleClose = () => {
    setIsWidgetOpen(false);
    sessionStorage.setItem("gameWidgetClosed", "true");
  };

  const getGameState = (game) => {
    const now = new Date();
    if (now < new Date(game.startTime)) return "upcoming";
    if (now > new Date(game.endTime)) {
      if (now - new Date(game.endTime) < 24 * 60 * 60 * 1000) return "final";
      return "expired";
    }
    return "live";
  };

  const updateScore = (gameId, teamIndex, score) => {
    if (!socket) return;
    socket.emit("updateScore", { gameId, teamIndex, score });
  };

  const handleGameUpdate = async (gameData) => {
    if (!socket) return;
    try {
      await axios.put(`https://pear-tsk2.onrender.com/api/games/${gameData._id}`, gameData);
      socket.emit("updateGame", gameData);
    } catch (error) {
      console.error("Failed to update game:", error);
    }
  };

  const handleGameDelete = async (gameId) => {
    if (!socket) return;
    try {
      await axios.delete(`https://pear-tsk2.onrender.com/api/games/${gameId}`);
      socket.emit("deleteGame", gameId);
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  const visibleGames = games
    .map(g => ({ ...g, state: getGameState(g) }))
    .filter(g => g.state !== "expired")
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3);

  const moreCount = games.length - visibleGames.length;

  if (!isWidgetOpen) return null;

  return (
    <Box
      id="game-widget"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2000}
      w="380px"
      bg={widgetBg}
      borderRadius="16px"
      p={4}
      boxShadow="2xl"
      border={`1.5px solid ${borderCol}`}
      cursor={dragging ? "grabbing" : "default"}
      userSelect={dragging ? "none" : "auto"}
      display={{ base: "none", md: "block" }}
    >
      <Flex justify="space-between" align="center" mb={2} onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <Text fontWeight="bold" fontSize="xl" color={titleColor}>Games</Text>
        <Text fontSize="sm" color="gray.500">on Pear Media</Text>
        <IconButton icon={<CloseIcon />} size="sm" onClick={handleClose} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
      </Flex>

      {visibleGames.length === 0 ? (
        <Box mt={4}><Text>No games upcoming</Text></Box>
      ) : (
        visibleGames.map(game => (
          <Box key={game._id} my={3} p={2} borderRadius="md" bg="gray.50">
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">{game.teams.map(t => t.name).join(" vs ")}</Text>
              <Badge colorScheme={
                game.state === "upcoming" ? "yellow" :
                game.state === "live" ? "green" : "gray"
              }>
                {game.state}
              </Badge>
            </Flex>
            <Text fontSize="sm">{game.sport} | {game.category}</Text>
            <Text fontSize="sm">
              {new Date(game.startTime).toLocaleString()} - {new Date(game.endTime).toLocaleString()}
            </Text>
            {isAdmin && (
              <Menu>
                <MenuButton as={IconButton} icon={<SettingsIcon />} size="sm" mt={2} />
                <MenuList>
                  <MenuItem onClick={() => {
                    const newScore = prompt("Enter new score for " + game.teams[0].name);
                    if (newScore !== null) {
                      updateScore(game._id, 0, parseInt(newScore));
                    }
                  }}>
                    Update Score
                  </MenuItem>
                  <MenuItem onClick={() => {
                    if (window.confirm("Are you sure you want to delete this game?")) {
                      handleGameDelete(game._id);
                    }
                  }}>
                    Delete Game
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>
        ))
      )}

      {moreCount > 0 && (
        <Button size="sm" mt={2} w="full">+{moreCount} more</Button>
      )}
    </Box>
  );
};

export default GameWidget; 