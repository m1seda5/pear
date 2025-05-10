import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Progress, Button, useColorModeValue, useToast, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Confetti from "react-confetti";

const HOUSES = [
  { name: "Samburu", color: "#4CAF50", key: "samburu", bg: "#dbeedb" },
  { name: "Mara", color: "#1E40AF", key: "mara", bg: "#dbeafe" },
  { name: "Amboseli", color: "#EF4444", key: "amboseli", bg: "#fde2e2" },
  { name: "Tsavo", color: "#FBBF24", key: "tsavo", bg: "#fdf6e3" },
];
const initialProgress = { samburu: 0, mara: 0, amboseli: 0, tsavo: 0 };
const DEFAULT_POSITION = { top: 180, left: typeof window !== 'undefined' ? window.innerWidth - 420 : 100 };

const HousePointTracker = ({ showTutorial }) => {
  const user = useRecoilValue(userAtom);
  const isAdmin = user?.role === "admin";
  const [progress, setProgress] = useState(() => {
    return JSON.parse(localStorage.getItem("houseProgress")) || initialProgress;
  });
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef(0);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("housePointTrackerPosition");
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_POSITION; }
    }
    return DEFAULT_POSITION;
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const widgetBg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOpen, setIsOpen] = useState(() => sessionStorage.getItem("housePointTrackerClosed") !== "true");

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      setPosition(pos => {
        const newPos = {
          left: Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - 480),
          top: Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - 120)
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

  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem("houseProgress", JSON.stringify(newProgress));
  };

  const handleWidgetTap = () => {
    if (!isAdmin) return;
    const now = Date.now();
    if (now - lastTap.current < 300) setExpanded(e => !e);
    lastTap.current = now;
  };

  const adjustProgress = (key, delta) => {
    const newValue = Math.max(0, Math.min(100, progress[key] + delta));
    const newProgress = { ...progress, [key]: newValue };
    saveProgress(newProgress);
    if (newValue === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  };

  const resetAll = () => {
    saveProgress(initialProgress);
    toast({ title: "House points reset", status: "info" });
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("housePointTrackerClosed", "true");
  };

  useEffect(() => {
    if (isOpen) sessionStorage.setItem("housePointTrackerClosed", "false");
  }, [isOpen]);

  // Hide during tutorial
  if (showTutorial || !isOpen) return null;

  return (
    <Box
      id="house-point-tracker"
      position="fixed"
      left={position.left + "px"}
      top={position.top + "px"}
      zIndex={2000}
      w={expanded ? "420px" : "340px"}
      bg={widgetBg}
      borderRadius="24px"
      p={expanded ? 6 : 4}
      boxShadow="2xl"
      border={`1.5px solid ${borderCol}`}
      cursor={dragging ? "grabbing" : "default"}
      userSelect={dragging ? "none" : "auto"}
      transition="width 0.2s, padding 0.2s"
      onClick={handleWidgetTap}
    >
      {showConfetti && <Confetti width={420} height={220} recycle={false} numberOfPieces={180} />} 
      <Flex justify="space-between" align="center" mb={4} onMouseDown={startDrag} style={{ cursor: "grab" }}>
        <Box>
          <Text fontWeight="bold" fontSize="xl" color="orange.700">House Points</Text>
          <Text fontSize="md" color="gray.500">on Pear Media</Text>
        </Box>
        <IconButton icon={<CloseIcon />} size="sm" onClick={e => { e.stopPropagation(); handleClose(); }} aria-label="Close" bg="transparent" _hover={{ bg: widgetBg }} />
      </Flex>
      {HOUSES.map((house) => (
        <Flex key={house.key} align="center" mb={5}>
          <Box
            w={5}
            h={5}
            borderRadius="full"
            bg={house.color}
            mr={3}
            border="2px solid"
            borderColor={borderCol}
          />
          <Text w="90px" fontSize="md" fontWeight="medium">{house.name}</Text>
          <Box flex={1} mx={2} position="relative">
            <Box w="100%" h="28px" bg={house.bg} borderRadius="full" position="absolute" top={0} left={0} zIndex={0} />
            <Box
              w={`${progress[house.key]}%`}
              h="28px"
              bg={house.color}
              borderRadius="full"
              position="relative"
              zIndex={1}
              transition="width 0.4s cubic-bezier(.4,2,.6,1)"
              sx={progress[house.key] >= 90 ? { animation: "pulse 1s infinite alternate" } : {}}
            />
            {/* Pulse animation for 90%+ */}
            {progress[house.key] >= 90 && (
              <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="28px"
                borderRadius="full"
                pointerEvents="none"
                sx={{
                  boxShadow: `0 0 16px 4px ${house.color}`,
                  animation: "pulseGlow 1s infinite alternate"
                }}
              />
            )}
          </Box>
          {expanded && isAdmin && (
            <Flex direction="column" ml={3} gap={1}>
              <Button size="xs" onClick={e => { e.stopPropagation(); adjustProgress(house.key, 10); }}>+10%</Button>
              <Button size="xs" onClick={e => { e.stopPropagation(); adjustProgress(house.key, -10); }}>-10%</Button>
            </Flex>
          )}
        </Flex>
      ))}
      {expanded && isAdmin && (
        <Button size="md" mt={2} onClick={resetAll} w="full" colorScheme="gray">
          Reset All
        </Button>
      )}
      <style>{`
        @keyframes pulse {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.2); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); }
          100% { box-shadow: 0 0 16px 8px rgba(0,0,0,0.2); }
        }
      `}</style>
    </Box>
  );
};

export default HousePointTracker; 