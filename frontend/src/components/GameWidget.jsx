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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Select,
  Image,
  useToast,
  Spinner,
  Avatar
} from "@chakra-ui/react";
import { CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const DEFAULT_POSITION = { top: 280, left: typeof window !== 'undefined' ? window.innerWidth - 400 : 100 };

const emptyGame = {
  teams: [
    { name: "", logo: "", score: 0 },
    { name: "", logo: "", score: 0 }
  ],
  sport: "",
  category: "",
  startTime: "",
  endTime: "",
  background: "",
  confettiTeam: ""
};

const IndividualGameWidget = ({ game, onSave, isAdminEditing, onToggleEdit }) => {
  const currentUser = useRecoilValue(userAtom);
  const [editData, setEditData] = useState(game || {});
  const toast = useToast();

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave(editData);
      toast({ title: 'Game saved!', status: 'success' });
    } catch (error) {
      toast({ title: 'Error saving game', status: 'error' });
    }
  };

  return (
    <MotionBox
      p={4}
      m={2}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      animate={isAdminEditing ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
    >
      {isAdminEditing ? (
        <Flex direction="column" gap={3}>
          <Input
            placeholder="Sport Type"
            value={editData.sport}
            onChange={(e) => handleFieldChange('sport', e.target.value)}
          />
          <Input
            type="datetime-local"
            value={editData.startTime}
            onChange={(e) => handleFieldChange('startTime', e.target.value)}
          />
          {game?.teams?.map((team, index) => (
            <Flex key={index} gap={2}>
              <Avatar src={team.logo} />
              <Input
                value={team.name}
                onChange={(e) => handleFieldChange(`teams[${index}].name`, e.target.value)}
              />
              <Input
                type="number"
                value={team.score}
                onChange={(e) => handleFieldChange(`teams[${index}].score`, e.target.value)}
              />
            </Flex>
          ))}
          <Button colorScheme="blue" onClick={handleSave}>
            Save Game
          </Button>
        </Flex>
      ) : (
        <Flex direction="column">
          <Text fontSize="xl" fontWeight="bold">{game?.sport}</Text>
          <Flex justify="space-around">
            {game?.teams?.map((team, index) => (
              <Flex key={index} align="center" gap={2}>
                <Avatar src={team.logo} />
                <Text>{team.name}</Text>
                <Text fontSize="2xl">{team.score}</Text>
              </Flex>
            ))}
          </Flex>
          <Text color="gray.500">
            {new Date(game?.startTime).toLocaleString()}
          </Text>
        </Flex>
      )}
    </MotionBox>
  );
};

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
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminGames, setAdminGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editGame, setEditGame] = useState(emptyGame);
  const [editingGameId, setEditingGameId] = useState(null);
  const lastTap = useRef(0);
  const toast = useToast();
  const widgetBg = useColorModeValue("rgba(255,255,255,0.85)", "rgba(20,20,20,0.95)");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("black", "white");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://pear-tsk2.onrender.com/api/games");
        setGames(res.data);
        setAdminGames(res.data.slice(0, 10));
      } catch (error) {
        toast({ title: "Failed to fetch games", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchGames();

    if (!socket) return;

    socket.on("gameUpdated", updatedGame => {
      setGames(prev => prev.map(g => g._id === updatedGame._id ? updatedGame : g));
      setAdminGames(prev => prev.map(g => g._id === updatedGame._id ? updatedGame : g));
    });

    socket.on("gameCreated", newGame => {
      setGames(prev => [...prev, newGame]);
      setAdminGames(prev => [...prev, newGame].slice(0, 10));
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
      setAdminGames(prev => prev.map(game => {
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
      setAdminGames(prev => prev.filter(g => g._id !== gameId));
    });

    return () => {
      socket.off("gameUpdated");
      socket.off("gameCreated");
      socket.off("scoreUpdated");
      socket.off("gameDeleted");
    };
  }, [socket, toast]);

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

  const handleTitleTap = () => {
    if (!isAdmin) return;
    const now = Date.now();
    if (now - lastTap.current < 350) {
      setAdminModalOpen(true);
    }
    lastTap.current = now;
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
      toast({ title: "Game updated!", status: "success", duration: 1200 });
    } catch (error) {
      toast({ title: "Failed to update game", status: "error" });
    }
  };

  const handleGameDelete = async (gameId) => {
    if (!socket) return;
    try {
      await axios.delete(`https://pear-tsk2.onrender.com/api/games/${gameId}`);
      socket.emit("deleteGame", gameId);
      toast({ title: "Game deleted!", status: "success", duration: 1200 });
    } catch (error) {
      toast({ title: "Failed to delete game", status: "error" });
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
        <Text fontWeight="bold" fontSize="xl" color={titleColor} style={{ userSelect: "none" }}>Games</Text>
        <Text fontSize="sm" color="gray.500">on Pear Media</Text>
        <IconButton icon={<CloseIcon />} size="sm" onClick={handleClose} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
        {isAdmin && (
          <IconButton
            icon={<SettingsIcon />}
            aria-label="Admin controls"
            size="sm"
            ml={2}
            onClick={() => setAdminModalOpen(true)}
            bg={adminModalOpen ? "gray.200" : "transparent"}
            _hover={{ bg: "gray.100" }}
          />
        )}
      </Flex>

      {visibleGames.length === 0 ? (
        <Box mt={4}><Text>No games upcoming</Text></Box>
      ) : (
        visibleGames.map(game => (
          <IndividualGameWidget
            key={game._id}
            game={game}
            onSave={handleGameUpdate}
            isAdminEditing={editingGameId === game._id}
            onToggleEdit={() => setEditingGameId(editingGameId === game._id ? null : game._id)}
          />
        ))
      )}

      {moreCount > 0 && (
        <Button size="sm" mt={2} w="full">+{moreCount} more</Button>
      )}

      <Modal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} size="2xl" closeOnOverlayClick>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Games</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading && <Spinner size="sm" />}
            {adminGames.map((game, idx) => (
              <Box key={game._id || idx} borderWidth="1px" borderRadius="md" p={3} mb={3}>
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">{game.teams.map(t => t.name).join(" vs ")}</Text>
                  <Button size="xs" colorScheme="blue" mr={2} onClick={() => {
                    setEditingIndex(idx);
                    setEditGame(game);
                  }}>Edit</Button>
                  <Button size="xs" colorScheme="red" onClick={() => handleGameDelete(game._id)}>Delete</Button>
                </Flex>
                <Text fontSize="sm">{game.sport} | {game.category}</Text>
                <Text fontSize="sm">
                  {new Date(game.startTime).toLocaleString()} - {new Date(game.endTime).toLocaleString()}
                </Text>
              </Box>
            ))}
            {adminGames.length < 10 && (
              <Button colorScheme="green" size="sm" onClick={() => {
                setEditingIndex(null);
                setEditGame(emptyGame);
              }}>Add New Game</Button>
            )}
            {(editingIndex !== null || editGame !== emptyGame) && (
              <Box borderWidth="1px" borderRadius="md" p={3} mt={2}>
                <Text fontWeight="bold" mb={2}>{editingIndex === null ? "Add New Game" : "Edit Game"}</Text>
                <Flex gap={2} mb={2} align="center">
                  <Input placeholder="Team 1 Name" value={editGame.teams[0].name} onChange={e => setEditGame(g => ({ ...g, teams: [{ ...g.teams[0], name: e.target.value }, g.teams[1]] }))} />
                  <Button size="sm" onClick={() => setEditGame(g => ({ ...g, teams: [{ ...g.teams[0], score: Math.max(0, g.teams[0].score - 1) }, g.teams[1]] }))}>-</Button>
                  <Input type="number" min={0} max={999} value={editGame.teams[0].score} onChange={e => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    val = Math.max(0, Math.min(999, val));
                    setEditGame(g => ({ ...g, teams: [{ ...g.teams[0], score: val }, g.teams[1]] }));
                  }} w="60px" textAlign="center" />
                  <Button size="sm" onClick={() => setEditGame(g => ({ ...g, teams: [{ ...g.teams[0], score: Math.min(999, g.teams[0].score + 1) }, g.teams[1]] }))}>+</Button>
                </Flex>
                <Flex gap={2} mb={2} align="center">
                  <Input placeholder="Team 2 Name" value={editGame.teams[1].name} onChange={e => setEditGame(g => ({ ...g, teams: [g.teams[0], { ...g.teams[1], name: e.target.value }] }))} />
                  <Button size="sm" onClick={() => setEditGame(g => ({ ...g, teams: [g.teams[0], { ...g.teams[1], score: Math.max(0, g.teams[1].score - 1) }] }))}>-</Button>
                  <Input type="number" min={0} max={999} value={editGame.teams[1].score} onChange={e => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    val = Math.max(0, Math.min(999, val));
                    setEditGame(g => ({ ...g, teams: [g.teams[0], { ...g.teams[1], score: val }] }));
                  }} w="60px" textAlign="center" />
                  <Button size="sm" onClick={() => setEditGame(g => ({ ...g, teams: [g.teams[0], { ...g.teams[1], score: Math.min(999, g.teams[1].score + 1) }] }))}>+</Button>
                </Flex>
                <Flex gap={2} mb={2}>
                  <Input placeholder="Team 1 Logo URL" value={editGame.teams[0].logo} onChange={e => setEditGame(g => ({ ...g, teams: [{ ...g.teams[0], logo: e.target.value }, g.teams[1]] }))} />
                  <Input placeholder="Team 2 Logo URL" value={editGame.teams[1].logo} onChange={e => setEditGame(g => ({ ...g, teams: [g.teams[0], { ...g.teams[1], logo: e.target.value }] }))} />
                </Flex>
                <Flex gap={2} mb={2}>
                  <Input placeholder="Sport" value={editGame.sport} onChange={e => setEditGame(g => ({ ...g, sport: e.target.value }))} />
                  <Input placeholder="Category" value={editGame.category} onChange={e => setEditGame(g => ({ ...g, category: e.target.value }))} />
                </Flex>
                <Flex gap={2} mb={2}>
                  <Input type="datetime-local" placeholder="Start Time" value={editGame.startTime} onChange={e => setEditGame(g => ({ ...g, startTime: e.target.value }))} />
                  <Input type="datetime-local" placeholder="End Time" value={editGame.endTime} onChange={e => setEditGame(g => ({ ...g, endTime: e.target.value }))} />
                </Flex>
                <Input placeholder="Background Image URL" value={editGame.background} onChange={e => setEditGame(g => ({ ...g, background: e.target.value }))} mb={2} />
                <Input placeholder="Confetti Team (name)" value={editGame.confettiTeam} onChange={e => setEditGame(g => ({ ...g, confettiTeam: e.target.value }))} mb={2} />
                <Flex gap={2}>
                  <Button colorScheme="blue" size="sm" onClick={() => {
                    setLoading(true);
                    handleGameUpdate(editGame);
                    setAdminModalOpen(false);
                  }} isLoading={loading}>Save</Button>
                  <Button size="sm" onClick={() => {
                    setEditingIndex(null);
                    setEditGame(emptyGame);
                  }}>Cancel</Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setAdminModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GameWidget;