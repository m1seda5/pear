import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Button, useColorModeValue, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const HOUSES = [
  { name: "Samburu", color: "#4CAF50", key: "samburu", bg: "#dbeedb" },
  { name: "Mara", color: "#1E40AF", key: "mara", bg: "#dbeafe" },
  { name: "Amboseli", color: "#EF4444", key: "amboseli", bg: "#fde2e2" },
  { name: "Tsavo", color: "#FBBF24", key: "tsavo", bg: "#fdf6e3" },
];
const initialProgress = { samburu: 0, mara: 0, amboseli: 0, tsavo: 0 };
const DEFAULT_POSITION = { top: 180, left: typeof window !== 'undefined' ? window.innerWidth - 400 : 100 };

const HousePointTracker = ({ showTutorial }) => {
  const [progress, setProgress] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("housePointTrackerPosition");
    if (saved) try { return JSON.parse(saved); } catch { return DEFAULT_POSITION; }
    return DEFAULT_POSITION;
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const widgetBg = useColorModeValue("rgba(255,255,255,0.85)", "rgba(20,20,20,0.95)");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("black", "white");
  const [isOpen, setIsOpen] = useState(() => sessionStorage.getItem("housePointTrackerClosed") !== "true");
  const isAdmin = true; // Replace with your admin check
  const { socket } = useSocket();
  const [error, setError] = useState("");
  const toast = useToast();
  const adminRef = useRef();

  // Only fetch once on mount (on refresh)
  useEffect(() => {
    axios.get("/api/house-points").then(res => {
      setProgress(res.data);
      setError("");
    }).catch(() => {
      setError("Failed to fetch house points");
    });
  }, []);

  // Real-time updates (no toast)
  useEffect(() => {
    if (!socket) return;
    const update = (data) => setProgress(data);
    socket.on("housePointsUpdated", update);
    return () => socket.off("housePointsUpdated", update);
  }, [socket]);

  // Admin update
  const saveProgress = async (newProgress) => {
    if (!socket) return;
    try {
      await axios.put("/api/house-points", newProgress);
      socket.emit("updateHousePoints", newProgress);
      setProgress(newProgress);
      toast({ title: "Points updated!", status: "success", duration: 1200 });
    } catch (error) {
      toast({ title: "Failed to update points", status: "error", duration: 2000 });
    }
  };

  const resetAll = async () => {
    try {
      await axios.post("/api/house-points/reset");
      socket.emit("resetHousePoints");
      setProgress(initialProgress); // Optimistic update
      toast({ title: "Points reset!", status: "success", duration: 1200 });
    } catch (error) {
      toast({ title: "Failed to reset", status: "error", duration: 2000 });
    }
  };

  // Drag logic
  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 460),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 80)
        };
        localStorage.setItem("housePointTrackerPosition", JSON.stringify(newPos));
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
    const widget = document.getElementById("house-point-tracker");
    const rect = widget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Admin controls: open/close with button, close on outside click or Escape
  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [expanded]);

  // Widget open/close persistence
  useEffect(() => {
    if (isOpen) sessionStorage.setItem("housePointTrackerClosed", "false");
    else sessionStorage.setItem("housePointTrackerClosed", "true");
  }, [isOpen]);

  // Always show widget after login/refresh
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleIncrement = (houseKey, delta) => {
    if (!progress) return;
    const newVal = Math.max(0, Math.min(100, progress[houseKey] + delta));
    const newProgress = { ...progress, [houseKey]: newVal };
    saveProgress(newProgress);
  };

  if (showTutorial || !isOpen) return null;

  return (
    <Box
      id="house-point-tracker"
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
      transition="width 0.2s, padding 0.2s"
    >
      <Flex justify="space-between" align="center" mb={2} onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <Text fontWeight="bold" fontSize="xl" color={titleColor}>House Points</Text>
        <Text fontSize="sm" color="gray.500">on Pear Media</Text>
        <IconButton icon={<CloseIcon />} size="sm" onClick={e => { e.stopPropagation(); setIsOpen(false); }} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
      </Flex>
      {error && <Text color="red.500" fontSize="sm" mb={2}>{error}</Text>}
      {!progress ? (
        <Flex justify="center"><Text>Loading...</Text></Flex>
      ) : (
        HOUSES.map((house) => (
          <Flex key={house.key} align="center" mb={5}>
            <Box w={5} h={5} borderRadius="full" bg={house.color} mr={3} border="2px solid" borderColor={borderCol} />
            <Text w="90px" fontSize="md" fontWeight="medium">{house.name}</Text>
            <Box flex={1} mx={2} position="relative">
              <Box w="100%" h="28px" bg={house.bg} borderRadius="full" position="absolute" top={0} left={0} zIndex={0} />
              <Box
                w={`${progress[house.key]}%`}
                minW="0"
                maxW="100%"
                h="28px"
                bg={house.color}
                borderRadius="full"
                position="relative"
                zIndex={1}
                transition="width 0.4s cubic-bezier(.4,2,.6,1)"
              />
            </Box>
            {expanded && isAdmin && (
              <Flex direction="column" ml={3} gap={1} ref={adminRef}>
                <Button size="xs" onClick={() => handleIncrement(house.key, 2)}>+2%</Button>
                <Button size="xs" onClick={() => handleIncrement(house.key, -2)}>-2%</Button>
              </Flex>
            )}
          </Flex>
        ))
      )}
      {expanded && isAdmin && (
        <Button size="md" mt={2} onClick={resetAll} w="full" colorScheme="gray">
          Reset All
        </Button>
      )}
      {isAdmin && (
        <IconButton
          icon={<SettingsIcon />}
          aria-label="Admin controls"
          size="sm"
          mt={2}
          ml={2}
          onClick={() => setExpanded(e => !e)}
          bg={expanded ? "gray.200" : "transparent"}
          _hover={{ bg: "gray.100" }}
        />
      )}
    </Box>
  );
};

export default HousePointTracker;