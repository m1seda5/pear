import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Button, useColorModeValue, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
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
  const [progress, setProgress] = useState(initialProgress);
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef(0);
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

  // Real-time updates
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await axios.get("https://pear-tsk2.onrender.com/api/house-points");
        setProgress(res.data);
      } catch (error) {
        console.error("Failed to fetch house points:", error);
      }
    };
    fetchPoints();

    if (!socket) return;

    socket.on("housePointsUpdated", setProgress);
    return () => socket.off("housePointsUpdated");
  }, [socket]);

  // Admin update
  const saveProgress = async (newProgress) => {
    if (!socket) return;
    try {
      await axios.put("https://pear-tsk2.onrender.com/api/house-points", newProgress);
      socket.emit("updateHousePoints", newProgress);
    } catch (error) {
      console.error("Failed to update house points:", error);
    }
  };

  const resetAll = async () => {
    if (!socket) return;
    try {
      await axios.post("https://pear-tsk2.onrender.com/api/house-points/reset");
      socket.emit("resetHousePoints");
    } catch (error) {
      console.error("Failed to reset house points:", error);
    }
  };

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

  const handleWidgetTap = () => {
    if (!isAdmin) return;
    const now = Date.now();
    if (now - lastTap.current < 300) setExpanded(e => !e);
    lastTap.current = now;
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("housePointTrackerClosed", "true");
  };

  useEffect(() => {
    if (isOpen) sessionStorage.setItem("housePointTrackerClosed", "false");
  }, [isOpen]);

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
      onClick={handleWidgetTap}
    >
      <Flex justify="space-between" align="center" mb={2} onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <Text fontWeight="bold" fontSize="xl" color={titleColor}>House Points</Text>
        <Text fontSize="sm" color="gray.500">on Pear Media</Text>
        <IconButton icon={<CloseIcon />} size="sm" onClick={e => { e.stopPropagation(); handleClose(); }} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
      </Flex>
      {HOUSES.map((house) => (
        <Flex key={house.key} align="center" mb={5}>
          <Box w={5} h={5} borderRadius="full" bg={house.color} mr={3} border="2px solid" borderColor={borderCol} />
          <Text w="90px" fontSize="md" fontWeight="medium">{house.name}</Text>
          <Box flex={1} mx={2} position="relative">
            <Box w="100%" h="28px" bg={house.bg} borderRadius="full" position="absolute" top={0} left={0} zIndex={0} />
            <Box
              w={`calc(${progress[house.key]}% + 40px)`}
              minW="40px"
              h="28px"
              bg={house.color}
              borderRadius="full"
              position="relative"
              zIndex={1}
              transition="width 0.4s cubic-bezier(.4,2,.6,1)"
            />
          </Box>
          {expanded && isAdmin && (
            <Flex direction="column" ml={3} gap={1}>
              <Button size="xs" onClick={e => { e.stopPropagation(); saveProgress({ ...progress, [house.key]: Math.min(100, progress[house.key] + 10) }); }}>+10%</Button>
              <Button size="xs" onClick={e => { e.stopPropagation(); saveProgress({ ...progress, [house.key]: Math.max(0, progress[house.key] - 10) }); }}>-10%</Button>
            </Flex>
          )}
        </Flex>
      ))}
      {expanded && isAdmin && (
        <Button size="md" mt={2} onClick={resetAll} w="full" colorScheme="gray">
          Reset All
        </Button>
      )}
    </Box>
  );
};

export default HousePointTracker; 